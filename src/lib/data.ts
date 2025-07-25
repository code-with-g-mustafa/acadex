
import { collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getAISummary } from '@/app/actions';

export type Resource = {
  id: string;
  university: string;
  department: string;
  semester: string;
  subject: string;
  title: string;
  description: string;
  fileType: 'Note' | 'Past Paper' | 'Lab Manual';
  fileUrl: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  summary: string;
  shortNotes: string;
  content: string; // This can hold extracted text for AI processing
  uploaderId: string;
  fileName: string;
};

export type UserData = {
    uid: string;
    email: string;
    role: 'Student' | 'Admin';
    university?: string;
    department?: string;
}

const universities = ['University of Technology', 'City College'];
const departments = ['Computer Science', 'Electrical Engineering'];
const semesters = ['1st', '2nd', '3rd', '4th'];
const subjects = {
  'Computer Science': ['Introduction to Programming', 'Data Structures', 'Algorithms'],
  'Electrical Engineering': ['Circuit Theory', 'Digital Logic Design', 'Signals and Systems'],
};

// Helper to extract text from a file. In a real app, this would be more sophisticated.
async function extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
        // In a real app, you would use a library like pdf.js to extract text.
        // For this demo, we'll return placeholder text.
        return `[Text from PDF: ${file.name}] - This is a placeholder. Full text extraction requires a server-side process or a more advanced client-side library.`;
    }
    if (file.type.startsWith('image/')) {
        // For images, text extraction (OCR) would be a complex server-side task.
        return `[Image file: ${file.name}] - No text content available.`;
    }
    // For plain text files
    return file.text();
}


export const addResource = async (
    data: {
      title: string;
      description: string;
      university: string;
      department: string;
      semester: string;
      subject: string;
      fileType: 'Note' | 'Past Paper' | 'Lab Manual';
      file: File;
      uploaderId: string;
    },
) => {
    if (!data.file) {
        throw new Error("File is required.");
    }

    try {
        const fileToUpload = data.file;

        // 1. Upload file to Firebase Storage
        const fileRef = ref(storage, `resources/${data.uploaderId}/${Date.now()}-${fileToUpload.name}`);
        const snapshot = await uploadBytes(fileRef, fileToUpload);
        const fileUrl = await getDownloadURL(snapshot.ref);

        // 2. Extract content for immediate use in AI assistant
        const extractedText = await extractTextFromFile(fileToUpload);

        // 3. Create document in Firestore
        const docRef = await addDoc(collection(db, 'resources'), {
            title: data.title,
            description: data.description,
            university: data.university,
            department: data.department,
            semester: data.semester,
            subject: data.subject,
            fileType: data.fileType,
            uploaderId: data.uploaderId,
            fileUrl,
            fileName: fileToUpload.name,
            status: 'pending',
            summary: 'Summary will be generated upon approval.',
            shortNotes: 'Notes will be generated upon approval.',
            content: extractedText, 
            tags: data.title.toLowerCase().split(' ').filter(Boolean).slice(0, 3),
        });

        return docRef.id;

    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not add resource. You may not have the required permissions.");
    }
};

export const updateResourceStatus = async (resourceId: string, status: 'approved' | 'rejected') => {
  const resourceRef = doc(db, 'resources', resourceId);
  
  try {
    if (status === 'approved') {
      const resourceDoc = await getDoc(resourceRef);
      const resourceData = resourceDoc.data();
      
      if (resourceData && resourceData.content) {
        // Update status to approved immediately
        await updateDoc(resourceRef, { 
          status: 'approved',
        });

        // Generate AI summary and notes in the background (no await)
        getAISummary(resourceData.content).then(aiData => {
          updateDoc(resourceRef, { 
            summary: aiData.summary,
            shortNotes: aiData.shortNotes
          });
        }).catch(error => {
          console.error("Failed to generate AI summary:", error);
           updateDoc(resourceRef, { 
            summary: "AI summary generation failed.",
            shortNotes: "AI note generation failed."
          });
        });

      } else {
         throw new Error("Resource not found or has no content to process.");
      }
    } else {
      // For rejection, just update the status
      await updateDoc(resourceRef, { status });
    }
  } catch (error) {
     console.error("Error updating resource status: ", error);
     throw new Error("Could not update resource status.");
  }
}

export const getResources = async (): Promise<Resource[]> => {
  const resourcesCol = collection(db, 'resources');
  const resourceSnapshot = await getDocs(resourcesCol);
  const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
  return resourceList;
};

export const getAdminResources = async (): Promise<Resource[]> => {
  // This function is now the same as getResources, client-side logic will handle sorting.
  return getResources();
};

export const getResourcesByUploader = async (uploaderId: string) => {
    const resourcesCol = collection(db, 'resources');
    const q = query(resourcesCol, where("uploaderId", "==", uploaderId));
    const resourceSnapshot = await getDocs(q);
    const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
    return resourceList;
};

export const getResourceById = async (id: string) => {
  const resourceRef = doc(db, 'resources', id);
  const resourceSnap = await getDoc(resourceRef);

  if (resourceSnap.exists()) {
    return { id: resourceSnap.id, ...resourceSnap.data() } as Resource;
  } else {
    return null;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        return { uid, ...userSnap.data() } as UserData;
    } else {
        return null;
    }
}

export const getFilters = () => ({
  universities,
  departments,
  semesters,
  subjects,
});
