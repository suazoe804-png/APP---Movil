import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Solicitud } from '../types';

const COLLECTION_NAME = 'solicitudes';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const createSolicitud = async (data: Omit<Solicitud, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'userId'>) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const newRef = doc(collection(db, COLLECTION_NAME));
    const now = Date.now();
    const solicitudData = {
      ...data,
      fechaCreacion: now,
      fechaActualizacion: now,
      userId
    };

    await setDoc(newRef, solicitudData);
    return newRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
  }
};

export const getSolicitudes = async (): Promise<Solicitud[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('fechaCreacion', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Solicitud));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
};

export const getSolicitudById = async (id: string): Promise<Solicitud | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Solicitud;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${id}`);
  }
};

export const updateSolicitud = async (id: string, data: Partial<Omit<Solicitud, 'id' | 'fechaCreacion' | 'userId'>>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const now = Date.now();
    await updateDoc(docRef, { ...data, fechaActualizacion: now });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
};

export const deleteSolicitud = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
};
