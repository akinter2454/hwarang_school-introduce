export type FloorNumber = 1 | 2 | 3 | 4 | 5;

export type SpaceStatus = 'approved' | 'pending' | 'rejected';

export interface SpaceItem {
  id: string;
  floor: FloorNumber;
  name: string;
  oneLineIntro: string;
  description: string;
  specialPoint: string;
  usageGuide: string;
  rules: string;
  author: string;
  studentGroup?: string;
  images: string[];
  status: SpaceStatus;
  reviewFeedback?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isTemplateExample?: boolean;
}

export type ViewMode = 'experience' | 'build' | 'admin';

export interface FloorInfo {
  floor: FloorNumber;
  name: string;
  subtitle: string;
  color: string;
  accentBg: string;
  badgeBg: string;
  description: string;
  suggestedPlaces: string[];
}

export type BuddyId = 'owl' | 'puppy' | 'cat' | 'bear' | 'rabbit' | 'boy' | 'girl';
export type OutfitId = 'vest' | 'uniform' | 'hoodie' | 'overalls' | 'cape';
export type HeadwearId = 'none' | 'safari' | 'crown' | 'cap' | 'flower' | 'headphone' | 'beret' | 'grad';
export type ToolItemId = 'magnifier' | 'camera' | 'map' | 'palette' | 'ball' | 'trophy' | 'flag';
export type ExpressionId = 'smile' | 'wink' | 'sparkle' | 'proud';
export type ThemeColorId = 'amber' | 'emerald' | 'sky' | 'purple' | 'rose';

export interface StudentCharacter {
  name: string;
  gradeClass: string;
  buddyId: BuddyId;
  outfit: OutfitId;
  headwear: HeadwearId;
  toolItem: ToolItemId;
  expression: ExpressionId;
  themeColor: ThemeColorId;
  unlockedTitles: string[];
}

export type CommentReaction = '👍 최고예요' | '📸 사진 멋져요' | '💡 꿀팁 감사' | '🏃 꼭 가볼래요' | '💖 추천해요' | '✨ 예뻐요';

export interface SpaceComment {
  id: string;
  spaceId: string; // space ID or 'general' for overall school guestbook
  spaceName?: string;
  floor?: FloorNumber;
  authorName: string;
  authorGradeClass: string;
  avatar: {
    buddyId: BuddyId;
    outfit: OutfitId;
    headwear: HeadwearId;
    toolItem: ToolItemId;
    expression: ExpressionId;
    themeColor: ThemeColorId;
  };
  content: string;
  reactionTag?: CommentReaction;
  createdAt: string;
  likes: number;
}

