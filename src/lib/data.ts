import { collection, addDoc, getDocs, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

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
  content: string;
  uploaderId: string;
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

export const addResource = async (resource: Omit<Resource, 'id' | 'status' | 'summary' | 'shortNotes' | 'content' | 'tags' | 'fileUrl' | 'uploaderId'>, uploaderId: string) => {
    try {
        const docRef = await addDoc(collection(db, 'resources'), {
            ...resource,
            uploaderId,
            status: 'pending',
            summary: 'AI summary is being generated...',
            shortNotes: 'AI notes are being generated...',
            content: 'Dummy content for now.',
            tags: resource.title.toLowerCase().split(' ').slice(0,3),
            fileUrl: '/placeholder.pdf',
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not add resource to database.");
    }
}

export const getResources = async (): Promise<Resource[]> => {
  const resourcesCol = collection(db, 'resources');
  const q = query(resourcesCol, where("status", "==", "approved"));
  const resourceSnapshot = await getDocs(q);
  const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
  return resourceList;
};

export const getAdminResources = async (): Promise<Resource[]> => {
  const resourcesCol = collection(db, 'resources');
  const resourceSnapshot = await getDocs(resourcesCol);
  const resourceList = resourceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
  return resourceList.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
  });
};

export const updateResourceStatus = async (resourceId: string, status: 'approved' | 'rejected') => {
  const resourceRef = doc(db, 'resources', resourceId);
  await updateDoc(resourceRef, { status });
}

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