
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

async function ensureMetadataDoc(docRef: any, initialData: any) {
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    try {
      await setDoc(docRef, initialData);
      return initialData;
    } catch (e) {
      // Potentially a race condition where another user created the doc.
      const freshSnap = await getDoc(docRef);
      if (freshSnap.exists()) {
        return freshSnap.data();
      }
      throw e; // Re-throw if it still doesn't exist.
    }
  }
  return docSnap.data();
}


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


export async function addUniversity(name: string) {
    const docRef = doc(db, 'metadata', 'universities');
    await ensureMetadataDoc(docRef, { list: defaultFilters.universities });
    await updateDoc(docRef, { list: arrayUnion(name) });
}

export async function addDepartment(name: string) {
    const docRef = doc(db, 'metadata', 'departments');
    await ensureMetadataDoc(docRef, { list: defaultFilters.departments });
    await updateDoc(docRef, { list: arrayUnion(name) });
    const subjectsRef = doc(db, 'metadata', 'subjects');
    const subjectsDoc = await getDoc(subjectsRef);
    if (!subjectsDoc.data()?.[name]) {
        await updateDoc(subjectsRef, { [name]: [] });
    }
}

export async function addSubject(department: string, subject: string) {
    const docRef = doc(db, 'metadata', 'subjects');
    await ensureMetadataDoc(docRef, defaultFilters.subjects);
    await updateDoc(docRef, { [`${department}`]: arrayUnion(subject) });
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

        const fileRef = ref(storage, `resources/${data.uploaderId}/${Date.now()}-${fileToUpload.name}`);
        const snapshot = await uploadBytes(fileRef, fileToUpload);
        const fileUrl = await getDownloadURL(snapshot.ref);

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
            status: 'pending',
            summary: 'Summary will be generated upon approval.',
            shortNotes: 'Notes will be generated upon approval.',
            content: '',
            tags: data.title.toLowerCase().split(' ').filter(Boolean).slice(0, 3),
            createdAt: new Date(),
        };
        
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
      const simulatedFileContent = `[Extracted text from ${resourceData.fileName}] - This content is now available for AI processing.`;

      await updateDoc(resourceRef, { 
        status: 'approved',
        content: simulatedFileContent,
      });

      getAISummary(simulatedFileContent).then(aiData => {
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
      await updateDoc(resourceRef, { status });
    }
  } catch (error) {
     console.error("Error updating resource status: ", error);
     throw new Error("Could not update resource status.");
  }
}

export const getResources = async (): Promise<Resource[]> => {
  try {
    const resourcesCol = collection(db, 'resources');
    const resourceSnapshot = await getDocs(resourcesCol);
    const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
    return resourceList;
  } catch(error) {
    console.error("Failed to get resources:", error)
    return []; // Return empty array on failure
  }
};

export const getAdminResources = async (): Promise<Resource[]> => {
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
  universities: defaultFilters.universities,
  departments: defaultFilters.departments,
  semesters: defaultFilters.semesters,
  subjects: defaultFilters.subjects,
});
