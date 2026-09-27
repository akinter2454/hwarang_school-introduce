import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import type {SpaceComment, SpaceItem} from '../types';
import {
  ensureAnonymousFirebaseUser,
  firebaseStorage,
  firestoreDb,
  isFirebaseConfigured,
} from '../lib/firebase';

function requireFirebase() {
  if (!isFirebaseConfigured || !firestoreDb || !firebaseStorage) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values first.');
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, body] = dataUrl.split(',');
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
  const binary = atob(body || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], {type: mime});
}

export async function uploadSpaceImageDataUrl(dataUrl: string, spaceId: string, index: number) {
  requireFirebase();
  const user = await ensureAnonymousFirebaseUser();
  if (!user || !firebaseStorage) throw new Error('Firebase authentication failed.');

  const blob = dataUrlToBlob(dataUrl);
  const path = `spaceImages/${user.uid}/${spaceId}/${Date.now()}-${index}.jpg`;
  const objectRef = ref(firebaseStorage, path);
  await uploadBytes(objectRef, blob, {contentType: blob.type || 'image/jpeg'});
  return getDownloadURL(objectRef);
}

export async function submitSpaceToFirebase(space: SpaceItem) {
  requireFirebase();
  const user = await ensureAnonymousFirebaseUser();
  if (!user || !firestoreDb) throw new Error('Firebase authentication failed.');

  await setDoc(doc(firestoreDb, 'spaces', space.id), {
    ...space,
    ownerUid: user.uid,
    status: 'pending',
    serverCreatedAt: serverTimestamp(),
    serverUpdatedAt: serverTimestamp(),
  });
}

export async function resubmitSpaceToFirebase(space: SpaceItem) {
  requireFirebase();
  const user = await ensureAnonymousFirebaseUser();
  if (!user || !firestoreDb) throw new Error('Firebase authentication failed.');

  await updateDoc(doc(firestoreDb, 'spaces', space.id), {
    ...space,
    ownerUid: user.uid,
    status: 'pending',
    serverUpdatedAt: serverTimestamp(),
  });
}

export async function deleteOwnSpaceFromFirebase(spaceId: string) {
  requireFirebase();
  await ensureAnonymousFirebaseUser();
  if (!firestoreDb) throw new Error('Firebase is unavailable.');
  await deleteDoc(doc(firestoreDb, 'spaces', spaceId));
}

export function subscribeApprovedSpaces(callback: (spaces: SpaceItem[]) => void): Unsubscribe {
  if (!firestoreDb) throw new Error('Firebase is not configured.');
  const q = query(
    collection(firestoreDb, 'spaces'),
    where('status', '==', 'approved'),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as SpaceItem));
  });
}

export async function addCommentToFirebase(comment: SpaceComment) {
  requireFirebase();
  const user = await ensureAnonymousFirebaseUser();
  if (!user || !firestoreDb) throw new Error('Firebase authentication failed.');

  await setDoc(doc(firestoreDb, 'comments', comment.id), {
    ...comment,
    authorUid: user.uid,
    serverCreatedAt: serverTimestamp(),
  });
}

export function subscribeComments(callback: (comments: SpaceComment[]) => void): Unsubscribe {
  if (!firestoreDb) throw new Error('Firebase is not configured.');
  const q = query(collection(firestoreDb, 'comments'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => d.data() as SpaceComment));
  });
}

/**
 * Teacher-only approval/rejection. Security Rules require a teacher custom claim.
 * The current client PIN (7777) must NOT be used as Firebase authorization.
 */
export async function reviewSpaceAsTeacher(
  spaceId: string,
  status: 'approved' | 'rejected',
  reviewFeedback?: string
) {
  requireFirebase();
  if (!firestoreDb) throw new Error('Firebase is unavailable.');

  await updateDoc(doc(firestoreDb, 'spaces', spaceId), {
    status,
    reviewFeedback: reviewFeedback || null,
    serverUpdatedAt: serverTimestamp(),
  });
}
