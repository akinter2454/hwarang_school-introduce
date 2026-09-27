import {DEFAULT_STUDENT_CHARACTER} from '../data/characterData';
import type {
  CommentReaction,
  ExpressionId,
  HeadwearId,
  OutfitId,
  SpaceComment,
  SpaceItem,
  StudentCharacter,
  ThemeColorId,
  ToolItemId,
  BuddyId,
} from '../types';

const SCHEMA_VERSION = 3;

const KEYS = {
  spacesV2: 'school_spaces_data_v2',
  spacesV1: 'school_spaces_data_v1',
  stamps: 'school_spaces_stamps_v1',
  likes: 'school_spaces_likes_v1',
  character: 'school_spaces_character_v1',
  comments: 'school_spaces_comments_v1',
  schema: 'school_spaces_schema_version',
} as const;

const BUDDIES = new Set<BuddyId>(['owl', 'puppy', 'cat', 'bear', 'rabbit', 'boy', 'girl']);
const OUTFITS = new Set<OutfitId>(['vest', 'uniform', 'hoodie', 'overalls', 'cape']);
const HEADWEAR = new Set<HeadwearId>(['none', 'safari', 'crown', 'cap', 'flower', 'headphone', 'beret', 'grad']);
const TOOLS = new Set<ToolItemId>(['magnifier', 'camera', 'map', 'palette', 'ball', 'trophy', 'flag']);
const EXPRESSIONS = new Set<ExpressionId>(['smile', 'wink', 'sparkle', 'proud']);
const COLORS = new Set<ThemeColorId>(['amber', 'emerald', 'sky', 'purple', 'rose']);
const REACTIONS = new Set<CommentReaction>([
  '👍 최고예요',
  '📸 사진 멋져요',
  '💡 꿀팁 감사',
  '🏃 꼭 가볼래요',
  '💖 추천해요',
  '✨ 예뻐요',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

const INVALID_JSON = Symbol('invalid-json');

function readStored(key: string): {exists: boolean; value: unknown | typeof INVALID_JSON} {
  const raw = localStorage.getItem(key);
  if (raw === null) return {exists: false, value: null};
  try {
    return {exists: true, value: JSON.parse(raw)};
  } catch {
    return {exists: true, value: INVALID_JSON};
  }
}

function safeSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Failed to write localStorage key: ${key}`, error);
    return false;
  }
}

function safeRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage access failures. ErrorBoundary still protects rendering.
  }
}

function normalizeSpace(value: unknown): SpaceItem | null {
  if (!isRecord(value)) return null;

  const floor = Number(value.floor);
  if (![1, 2, 3, 4].includes(floor)) return null;

  const id = text(value.id).trim();
  const name = text(value.name).trim();
  if (!id || !name) return null;

  const status = value.status === 'approved' || value.status === 'rejected' || value.status === 'pending'
    ? value.status
    : 'pending';

  const now = new Date().toISOString();

  return {
    id,
    floor: floor as 1 | 2 | 3 | 4,
    name,
    oneLineIntro: text(value.oneLineIntro),
    description: text(value.description),
    specialPoint: text(value.specialPoint),
    usageGuide: text(value.usageGuide),
    rules: text(value.rules),
    author: text(value.author, '학생 작성자'),
    studentGroup: typeof value.studentGroup === 'string' ? value.studentGroup : undefined,
    images: stringArray(value.images),
    status,
    reviewFeedback: typeof value.reviewFeedback === 'string' ? value.reviewFeedback : undefined,
    createdAt: text(value.createdAt, now),
    updatedAt: text(value.updatedAt, text(value.createdAt, now)),
    likes: Number.isFinite(Number(value.likes)) ? Math.max(0, Number(value.likes)) : 0,
    isTemplateExample: typeof value.isTemplateExample === 'boolean' ? value.isTemplateExample : undefined,
  };
}

function normalizeCharacter(value: unknown): StudentCharacter {
  if (!isRecord(value)) return DEFAULT_STUDENT_CHARACTER;

  const buddyId = BUDDIES.has(value.buddyId as BuddyId)
    ? (value.buddyId as BuddyId)
    : DEFAULT_STUDENT_CHARACTER.buddyId;
  const outfit = OUTFITS.has(value.outfit as OutfitId)
    ? (value.outfit as OutfitId)
    : DEFAULT_STUDENT_CHARACTER.outfit;
  const headwear = HEADWEAR.has(value.headwear as HeadwearId)
    ? (value.headwear as HeadwearId)
    : DEFAULT_STUDENT_CHARACTER.headwear;
  const toolItem = TOOLS.has(value.toolItem as ToolItemId)
    ? (value.toolItem as ToolItemId)
    : DEFAULT_STUDENT_CHARACTER.toolItem;
  const expression = EXPRESSIONS.has(value.expression as ExpressionId)
    ? (value.expression as ExpressionId)
    : DEFAULT_STUDENT_CHARACTER.expression;
  const themeColor = COLORS.has(value.themeColor as ThemeColorId)
    ? (value.themeColor as ThemeColorId)
    : DEFAULT_STUDENT_CHARACTER.themeColor;

  return {
    name: text(value.name, DEFAULT_STUDENT_CHARACTER.name),
    gradeClass: text(value.gradeClass, DEFAULT_STUDENT_CHARACTER.gradeClass),
    buddyId,
    outfit,
    headwear,
    toolItem,
    expression,
    themeColor,
    unlockedTitles: stringArray(value.unlockedTitles).length
      ? stringArray(value.unlockedTitles)
      : DEFAULT_STUDENT_CHARACTER.unlockedTitles,
  };
}

function normalizeComment(value: unknown): SpaceComment | null {
  if (!isRecord(value) || !isRecord(value.avatar)) return null;

  const id = text(value.id).trim();
  const spaceId = text(value.spaceId).trim();
  const content = text(value.content).trim();
  if (!id || !spaceId || !content) return null;

  const floorNumber = Number(value.floor);
  const reaction = REACTIONS.has(value.reactionTag as CommentReaction)
    ? (value.reactionTag as CommentReaction)
    : undefined;

  const normalizedAvatarCharacter = normalizeCharacter({
    ...DEFAULT_STUDENT_CHARACTER,
    ...value.avatar,
  });

  return {
    id,
    spaceId,
    spaceName: typeof value.spaceName === 'string' ? value.spaceName : undefined,
    floor: [1, 2, 3, 4].includes(floorNumber) ? (floorNumber as 1 | 2 | 3 | 4) : undefined,
    authorName: text(value.authorName, '탐험대원'),
    authorGradeClass: text(value.authorGradeClass, ''),
    avatar: {
      buddyId: normalizedAvatarCharacter.buddyId,
      outfit: normalizedAvatarCharacter.outfit,
      headwear: normalizedAvatarCharacter.headwear,
      toolItem: normalizedAvatarCharacter.toolItem,
      expression: normalizedAvatarCharacter.expression,
      themeColor: normalizedAvatarCharacter.themeColor,
    },
    content,
    reactionTag: reaction,
    createdAt: text(value.createdAt, new Date().toISOString()),
    likes: Number.isFinite(Number(value.likes)) ? Math.max(0, Number(value.likes)) : 0,
  };
}

function sanitizeSpaces(raw: unknown): SpaceItem[] | null {
  if (!Array.isArray(raw)) return null;
  const result = raw.map(normalizeSpace).filter((v): v is SpaceItem => v !== null);
  return result.length === raw.length ? result : result;
}

function sanitizeComments(raw: unknown): SpaceComment[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.map(normalizeComment).filter((v): v is SpaceComment => v !== null);
}

/**
 * Runs before React renders. It never changes the normal UI.
 * - Migrates the old v1 spaces key to v2.
 * - Repairs missing fields that older versions did not have.
 * - Removes malformed JSON that could otherwise crash rendering.
 * - Keeps the current localStorage key names so App.tsx behavior stays unchanged.
 */
export function prepareLocalStorage() {
  try {
    const current = readStored(KEYS.spacesV2);
    const legacy = readStored(KEYS.spacesV1);

    if (current.exists) {
      const spaces = current.value === INVALID_JSON ? null : sanitizeSpaces(current.value);
      if (spaces) safeSet(KEYS.spacesV2, spaces);
      else safeRemove(KEYS.spacesV2);
    } else if (legacy.exists) {
      const migrated = legacy.value === INVALID_JSON ? null : sanitizeSpaces(legacy.value);
      if (migrated) safeSet(KEYS.spacesV2, migrated);
      safeRemove(KEYS.spacesV1);
    }

    const stamps = readStored(KEYS.stamps);
    if (stamps.exists) {
      if (stamps.value !== INVALID_JSON && Array.isArray(stamps.value)) {
        safeSet(KEYS.stamps, stringArray(stamps.value));
      } else {
        safeRemove(KEYS.stamps);
      }
    }

    const likes = readStored(KEYS.likes);
    if (likes.exists) {
      if (likes.value !== INVALID_JSON && Array.isArray(likes.value)) {
        safeSet(KEYS.likes, stringArray(likes.value));
      } else {
        safeRemove(KEYS.likes);
      }
    }

    const character = readStored(KEYS.character);
    if (character.exists) {
      if (character.value !== INVALID_JSON && isRecord(character.value)) {
        safeSet(KEYS.character, normalizeCharacter(character.value));
      } else {
        safeRemove(KEYS.character);
      }
    }

    const comments = readStored(KEYS.comments);
    if (comments.exists) {
      const normalized = comments.value === INVALID_JSON ? null : sanitizeComments(comments.value);
      if (normalized) safeSet(KEYS.comments, normalized);
      else safeRemove(KEYS.comments);
    }

    localStorage.setItem(KEYS.schema, String(SCHEMA_VERSION));
  } catch (error) {
    console.warn('Browser storage preparation was skipped.', error);
  }
}

export function clearAppLocalData() {
  Object.values(KEYS).forEach(safeRemove);
}

export const LOCAL_DATA_SCHEMA_VERSION = SCHEMA_VERSION;
