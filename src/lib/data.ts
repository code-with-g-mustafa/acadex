import { collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
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
    email: string | null;
    name: string;
    role: 'Student' | 'Admin';
    university?: string;
    department?: string;
}

// Default data for initialization
const defaultFilters = {
    universities: ['University of Technology', 'City College'],
    departments: ['Computer Science', 'Electrical Engineering'],
    semesters: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
    subjects: {
      'Computer Science': ['Introduction to Programming', 'Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems'],
      'Electrical Engineering': ['Circuit Theory', 'Digital Logic Design', 'Signals and Systems', 'Electromagnetic Theory', 'Power Systems'],
    }
};

export async function getDynamicFilters() {
    const universitiesRef = doc(db, 'metadata', 'universities');
    const departmentsRef = doc(db, 'metadata', 'departments');
    const subjectsRef = doc(db, 'metadata', 'subjects');

    try {
        const [universitiesSnap, departmentsSnap, subjectsSnap] = await Promise.all([
            getDoc(universitiesRef),
            getDoc(departmentsRef),
            getDoc(subjectsRef),
        ]);

        const universitiesData = universitiesSnap.data();
        const departmentsData = departmentsSnap.data();
        const subjectsData = subjectsSnap.data();

        const universitiesList = universitiesData?.list?.length > 0 ? universitiesData.list : defaultFilters.universities;
        const departmentsList = departmentsData?.list?.length > 0 ? departmentsData.list : defaultFilters.departments;
        const subjectsMap = subjectsData ? subjectsData : defaultFilters.subjects;

        return {
            universities: universitiesList,
            departments: departmentsList,
            subjects: subjectsMap,
            semesters: defaultFilters.semesters,
        };
    } catch (error) {
        console.error("Error fetching dynamic filters, returning defaults:", error);
        return defaultFilters;
    }
}

export async function addUniversity(university: string) {
    const uniRef = doc(db, 'metadata', 'universities');
    await setDoc(uniRef, { list: arrayUnion(university) }, { merge: true });
}

export async function addDepartment(department: string) {
    const deptRef = doc(db, 'metadata', 'departments');
    await setDoc(deptRef, { list: arrayUnion(department) }, { merge: true });
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
    if (!data.uploaderId) {
        throw new Error("User is not authenticated.");
    }

    try {
        const fileToUpload = data.file;

        // 1. Upload the file to Firebase Storage
        const fileRef = ref(storage, `resources/${data.uploaderId}/${Date.now()}-${fileToUpload.name}`);
        const snapshot = await uploadBytes(fileRef, fileToUpload);
        const fileUrl = await getDownloadURL(snapshot.ref);
        
        // 2. Prepare the document for Firestore
        const docData = {
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
            status: 'pending', // Always pending on initial upload
            summary: '', // AI content is generated after approval
            shortNotes: '',
            content: '', // Raw content extracted after approval
            tags: data.title.toLowerCase().split(' ').filter(Boolean).slice(0, 3),
            createdAt: new Date(),
        };
        
        // 3. Add the document to the 'resources' collection
        const docRef = await addDoc(collection(db, 'resources'), docData);

        return docRef.id;

    } catch (e: any) {
        console.error("Error adding document. Raw error: ", e);
        if (e.code === 'permission-denied') {
            throw new Error("You do not have permission to upload. Please check your account and Firestore/Storage rules.");
        }
        throw new Error(`Could not add resource: ${e.message}`);
    }
};

export const updateResourceStatus = async (resourceId: string, status: 'approved' | 'rejected') => {
  const resourceRef = doc(db, 'resources', resourceId);
  
  try {
    if (status === 'approved') {
      const resourceDoc = await getDoc(resourceRef);
      if (!resourceDoc.exists()) throw new Error("Resource not found.");
      
      const resourceData = resourceDoc.data();
      // Simulate text extraction. In a real app, this would be a cloud function.
      const simulatedFileContent = `[Extracted text from ${resourceData.fileName}] - This content is now available for AI processing.`;

      // Immediately update status to 'approved' and set placeholder text
      await updateDoc(resourceRef, { 
        status: 'approved',
        content: simulatedFileContent,
        summary: "Generating summary...",
        shortNotes: "Generating notes..."
      });

      // Trigger AI summary generation asynchronously.
      getAISummary(simulatedFileContent).then(aiData => {
        // Update the document again with the AI data once it's ready.
        updateDoc(resourceRef, { 
          summary: aiData.summary,
          shortNotes: aiData.shortNotes
        });
      }).catch(error => {
        console.error("Failed to generate AI summary:", error);
         // If AI fails, update the fields to reflect that.
         updateDoc(resourceRef, { 
          summary: "AI summary generation failed. This might be a non-text file.",
          shortNotes: "AI note generation failed."
        });
      });
      
    } else {
      // For rejection, just update the status.
      await updateDoc(resourceRef, { status });
    }
  } catch (error) {
     console.error("Error updating resource status: ", error);
     throw new Error("Could not update resource status.");
  }
}

// Fetches only approved resources for public view
export const getResources = async (): Promise<Resource[]> => {
  try {
    const resourcesCol = collection(db, 'resources');
    const q = query(resourcesCol, where("status", "==", "approved"));
    const resourceSnapshot = await getDocs(q);
    const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
    return resourceList;
  } catch(error) {
    console.error("Failed to get resources:", error)
    return []; // Return empty array on failure
  }
};

// Fetches all resources for admin view
export const getAdminResources = async (): Promise<Resource[]> => {
  try {
    const resourcesCol = collection(db, 'resources');
    const resourceSnapshot = await getDocs(resourcesCol);
    const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
    return resourceList;
  } catch(error) {
    console.error("Failed to get admin resources:", error)
    return []; // Return empty array on failure
  }
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
