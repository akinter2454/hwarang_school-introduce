import {
  get,
  onValue,
  ref,
  remove,
  runTransaction,
  set,
  update,
} from 'firebase/database';
import type {SpaceComment, SpaceItem} from '../types';
import {
  ensureAnonymousFirebaseUser,
  firebaseRealtimeDb,
  isFirebaseConfigured,
} from '../lib/firebase';

type Unsubscribe = () => void;

function requireDatabase() {
  if (!isFirebaseConfigured || !firebaseRealtimeDb) {
    throw new Error(
      'Firebase Realtime Database가 설정되지 않았습니다. src/firebaseConfig.ts를 확인하세요.'
    );
  }
  return firebaseRealtimeDb;
}

function cleanForFirebase<T>(value: T): T {
  // Realtime Database는 undefined 값을 저장하지 못하므로 제거합니다.
  return JSON.parse(JSON.stringify(value)) as T;
}

function spacesToMap(spaces: SpaceItem[]) {
  return Object.fromEntries(
    spaces.map((space) => [space.id, cleanForFirebase(space)])
  );
}

function commentsToMap(comments: SpaceComment[]) {
  return Object.fromEntries(
    comments.map((comment) => [comment.id, cleanForFirebase(comment)])
  );
}

function snapshotValueToSpaces(value: unknown): SpaceItem[] {
  if (!value || typeof value !== 'object') return [];

  const result = Object.values(value as Record<string, unknown>)
    .filter((item): item is Record<string, unknown> => {
      return typeof item === 'object' && item !== null;
    })
    .map((item) => {
      const {ownerUid: _ownerUid, ...space} = item;
      return space as unknown as SpaceItem;
    });

  // 기존 동작과 유사하게 학생이 새로 작성한 항목은 앞쪽,
  // 기본 템플릿은 1~5층 순서로 유지합니다.
  return result.sort((a, b) => {
    const aTemplate = Boolean(a.isTemplateExample);
    const bTemplate = Boolean(b.isTemplateExample);

    if (aTemplate && bTemplate) return a.floor - b.floor;
    if (aTemplate !== bTemplate) return aTemplate ? 1 : -1;

    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
  });
}

function snapshotValueToComments(value: unknown): SpaceComment[] {
  if (!value || typeof value !== 'object') return [];

  return Object.values(value as Record<string, unknown>)
    .filter((item): item is Record<string, unknown> => {
      return typeof item === 'object' && item !== null;
    })
    .map((item) => {
      const {authorUid: _authorUid, ...comment} = item;
      return comment as unknown as SpaceComment;
    })
    .sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    );
}

/**
 * DB가 비어 있는 최초 1회에만 현재 브라우저의 데이터를 올립니다.
 * 따라서 기존 localStorage 자료가 있으면 첫 마이그레이션 때 보존됩니다.
 */
export async function seedRealtimeDatabaseIfEmpty(
  initialSpaces: SpaceItem[],
  initialComments: SpaceComment[]
) {
  const db = requireDatabase();
  await ensureAnonymousFirebaseUser();

  const spacesRef = ref(db, 'spaces');
  const commentsRef = ref(db, 'comments');
  const [spacesSnapshot, commentsSnapshot] = await Promise.all([
    get(spacesRef),
    get(commentsRef),
  ]);

  const tasks: Promise<void>[] = [];

  if (!spacesSnapshot.exists()) {
    tasks.push(set(spacesRef, spacesToMap(initialSpaces)));
  }

  if (!commentsSnapshot.exists()) {
    tasks.push(set(commentsRef, commentsToMap(initialComments)));
  }

  tasks.push(
    update(ref(db, 'meta'), {
      dataSchemaVersion: 1,
      lastConnectedAt: new Date().toISOString(),
    })
  );

  await Promise.all(tasks);
}

export function subscribeSpacesRealtime(
  callback: (spaces: SpaceItem[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireDatabase();
  return onValue(
    ref(db, 'spaces'),
    (snapshot) => callback(snapshotValueToSpaces(snapshot.val())),
    (error) => onError?.(error)
  );
}

export function subscribeCommentsRealtime(
  callback: (comments: SpaceComment[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = requireDatabase();
  return onValue(
    ref(db, 'comments'),
    (snapshot) => callback(snapshotValueToComments(snapshot.val())),
    (error) => onError?.(error)
  );
}

export async function upsertSpaceRealtime(space: SpaceItem) {
  const db = requireDatabase();
  const user = await ensureAnonymousFirebaseUser();
  if (!user) throw new Error('Firebase 익명 인증에 실패했습니다.');

  const ownerRef = ref(db, `spaces/${space.id}/ownerUid`);
  const ownerSnapshot = await get(ownerRef);
  const ownerUid =
    typeof ownerSnapshot.val() === 'string' ? ownerSnapshot.val() : user.uid;

  await set(
    ref(db, `spaces/${space.id}`),
    cleanForFirebase({
      ...space,
      ownerUid,
    })
  );
}

export async function replaceAllSpacesRealtime(spaces: SpaceItem[]) {
  const db = requireDatabase();
  await ensureAnonymousFirebaseUser();
  await set(ref(db, 'spaces'), spacesToMap(spaces));
}

export async function deleteSpaceRealtime(spaceId: string) {
  const db = requireDatabase();
  await ensureAnonymousFirebaseUser();
  await remove(ref(db, `spaces/${spaceId}`));
}

export async function reviewSpaceRealtime(
  spaceId: string,
  status: 'approved' | 'rejected',
  reviewFeedback?: string
) {
  const db = requireDatabase();
  await ensureAnonymousFirebaseUser();

  await update(ref(db, `spaces/${spaceId}`), {
    status,
    reviewFeedback: reviewFeedback?.trim() || null,
    updatedAt: new Date().toISOString(),
  });
}

export async function incrementSpaceLikeRealtime(spaceId: string) {
  const db = requireDatabase();
  await ensureAnonymousFirebaseUser();

  await runTransaction(ref(db, `spaces/${spaceId}/likes`), (current) => {
    const value = Number(current);
    return Number.isFinite(value) ? value + 1 : 1;
  });
}

export async function upsertCommentRealtime(comment: SpaceComment) {
  const db = requireDatabase();
  const user = await ensureAnonymousFirebaseUser();
  if (!user) throw new Error('Firebase 익명 인증에 실패했습니다.');

  await set(
    ref(db, `comments/${comment.id}`),
    cleanForFirebase({
      ...comment,
      authorUid: user.uid,
    })
  );
}

export async function deleteCommentRealtime(commentId: string) {
  const db = requireDatabase();
  await ensureAnonymousFirebaseUser();
  await remove(ref(db, `comments/${commentId}`));
}

export async function incrementCommentLikeRealtime(commentId: string) {
  const db = requireDatabase();
  await ensureAnonymousFirebaseUser();

  await runTransaction(ref(db, `comments/${commentId}/likes`), (current) => {
    const value = Number(current);
    return Number.isFinite(value) ? value + 1 : 1;
  });
}
