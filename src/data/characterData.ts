import { 
  BuddyId, 
  OutfitId, 
  HeadwearId, 
  ToolItemId, 
  ExpressionId, 
  ThemeColorId, 
  StudentCharacter 
} from '../types';

export interface BuddyConfig {
  id: BuddyId;
  name: string;
  category: '동물 단짝' | '초등 단짝';
  personality: string;
  emoji: string;
  tagline: string;
}

export const BUDDY_LIST: BuddyConfig[] = [
  {
    id: 'cat',
    name: '나비',
    category: '동물 단짝',
    personality: '호기심 많고 똘망똘망한 치즈 고양이',
    emoji: '🐱',
    tagline: '구석구석 숨겨진 학교 비밀을 쏙쏙 찾아내요!',
  },
  {
    id: 'puppy',
    name: '뭉치',
    category: '동물 단짝',
    personality: '신나게 꼬리 흔드는 바둑 강아지',
    emoji: '🐶',
    tagline: '친구들과 함께 신나게 학교를 누벼요!',
  },
  {
    id: 'bear',
    name: '곰곰이',
    category: '동물 단짝',
    personality: '다정하고 든든한 포근 아기 곰',
    emoji: '🐻',
    tagline: '친구들을 따뜻하게 도와주고 안아줘요!',
  },
  {
    id: 'rabbit',
    name: '토토',
    category: '동물 단짝',
    personality: '깡충깡충 사랑스러운 하양 토끼',
    emoji: '🐰',
    tagline: '높은 층도 껑충껑충 빠르게 안내해 줘요!',
  },
  {
    id: 'owl',
    name: '솔이',
    category: '동물 단짝',
    personality: '지혜롭고 책을 좋아하는 탐험 대장',
    emoji: '🦉',
    tagline: '우리 학교의 역사와 공간 규칙을 잘 알아요!',
  },
  {
    id: 'boy',
    name: '도윤이',
    category: '초등 단짝',
    personality: '활기차고 씩씩한 스쿨 탐험 소년',
    emoji: '👦',
    tagline: '체육관과 운동장 달리기가 제일 신나요!',
  },
  {
    id: 'girl',
    name: '서연이',
    category: '초등 단짝',
    personality: '웃음 가득 상큼 발랄 스쿨 탐험 소녀',
    emoji: '👧',
    tagline: '도서관과 미술실에서 꿈을 키워가요!',
  },
];

export const OUTFIT_LIST: { id: OutfitId; name: string; emoji: string; desc: string }[] = [
  { id: 'vest', name: '탐험가 조끼', emoji: '🦺', desc: '도구 주머니와 지퍼가 달린 정통 탐험 복장' },
  { id: 'uniform', name: '단정한 교복', emoji: '👔', desc: '카라 셔츠와 빨간 넥타이의 깔끔한 스쿨룩' },
  { id: 'hoodie', name: '스쿨 후드티', emoji: '🧥', desc: '따뜻한 주머니와 캐주얼한 스트리트룩' },
  { id: 'overalls', name: '멜빵 청바지', emoji: '👖', desc: '황금 단추가 달린 귀여운 데님 멜빵룩' },
  { id: 'cape', name: '영웅의 망토', emoji: '🦸', desc: '황금 별 브로치와 펄럭이는 슈퍼 망토' },
];

export const HEADWEAR_LIST: { id: HeadwearId; name: string; emoji: string; desc: string }[] = [
  { id: 'safari', name: '사파리 탐험모', emoji: '🤠', desc: '챙이 넓고 탐험 배지가 달린 모자' },
  { id: 'cap', name: '스포티 야구모', emoji: '🧢', desc: '활동적이고 시원한 캡모자' },
  { id: 'crown', name: '반짝 황금왕관', emoji: '👑', desc: '보석이 총총 박힌 품격 있는 왕관' },
  { id: 'beret', name: '예술가 베레모', emoji: '🎨', desc: '감성 가득한 스타일리시 빵모자' },
  { id: 'flower', name: '벚꽃 머리핀', emoji: '🌸', desc: '머리 옆에 화사하게 꽂힌 꽃핀' },
  { id: 'headphone', name: '비트 헤드폰', emoji: '🎧', desc: '신나는 음악이 뿜어져 나오는 헤드폰' },
  { id: 'grad', name: '명예 학사모', emoji: '🎓', desc: '금빛 술이 찰랑이는 탐험 박사 모자' },
  { id: 'none', name: '모자 없음', emoji: '✨', desc: '원래 머리 모양 그대로 자연스럽게!' },
];

export const TOOL_ITEM_LIST: { id: ToolItemId; name: string; emoji: string; desc: string }[] = [
  { id: 'magnifier', name: '보물 돋보기', emoji: '🔍', desc: '손에 꼭 쥐고 숨겨진 학교 보물을 관찰해요!' },
  { id: 'camera', name: '순간포착 카메라', emoji: '📷', desc: '멋진 공간을 찰칵 사진으로 남겨요!' },
  { id: 'flag', name: '탐험대 깃발', emoji: '🚩', desc: '우리 학교 탐험 성공을 알리는 승리의 깃발!' },
  { id: 'map', name: '비밀 보물지도', emoji: '🗺️', desc: '1~5층 지름길과 숨은 명소를 척척 찾아가요!' },
  { id: 'palette', name: '알록달록 팔레트', emoji: '🎨', desc: '예쁜 색깔로 우리 학교를 알록달록 칠해요!' },
  { id: 'trophy', name: '황금 명예 트로피', emoji: '🏆', desc: '열심히 학교를 탐방한 멋진 대원에게 주는 상!' },
  { id: 'ball', name: '열정 농구공', emoji: '🏀', desc: '체육관과 강당에서 친구들과 신나게 뛰놀아요!' },
];

export const EXPRESSION_LIST: { id: ExpressionId; name: string; emoji: string; desc: string }[] = [
  { id: 'smile', name: '방긋 미소', emoji: '😊', desc: '행복하고 따뜻하게 웃는 눈' },
  { id: 'wink', name: '깜찍 윙크', emoji: '😉', desc: '한쪽 눈을 찡긋 감은 귀여운 윙크' },
  { id: 'sparkle', name: '초롱초롱 별빛', emoji: '🤩', desc: '눈동자에 별빛이 쏟아지는 반짝반짝 눈' },
  { id: 'proud', name: '씩씩 당당', emoji: '😎', desc: '자신감 넘치고 용감한 탐험가의 표정' },
];

export const THEME_COLOR_CONFIG: Record<ThemeColorId, { name: string; bg: string; border: string; text: string; ring: string }> = {
  amber: { name: '해님 노랑', bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-950', ring: 'ring-amber-300' },
  emerald: { name: '새싹 초록', bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-950', ring: 'ring-emerald-300' },
  sky: { name: '맑은 하늘', bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-950', ring: 'ring-sky-300' },
  purple: { name: '꿈빛 보라', bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-950', ring: 'ring-purple-300' },
  rose: { name: '딸기 분홍', bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-950', ring: 'ring-rose-300' },
};

export const DEFAULT_STUDENT_CHARACTER: StudentCharacter = {
  name: '씩씩한 탐험이',
  gradeClass: '3학년 1반',
  buddyId: 'cat',
  outfit: 'vest',
  headwear: 'safari',
  toolItem: 'magnifier',
  expression: 'smile',
  themeColor: 'amber',
  unlockedTitles: ['🌱 새싹 탐험대원'],
};

export interface ExplorerRankInfo {
  title: string;
  badge: string;
  level: number;
  progressPercent: number;
  message: string;
}

export function getExplorerRank(stampedFloorCount: number): ExplorerRankInfo {
  switch (stampedFloorCount) {
    case 0:
      return {
        title: '🌱 새싹 탐험대원',
        badge: 'LV.1 새싹',
        level: 1,
        progressPercent: 10,
        message: '첫 번째 층 공간을 방문하고 도장을 찍어보세요!',
      };
    case 1:
      return {
        title: '🚶 발걸음 탐험대원',
        badge: 'LV.2 발걸음',
        level: 2,
        progressPercent: 35,
        message: '멋진 시작이에요! 다른 층도 탐험해 볼까요?',
      };
    case 2:
      return {
        title: '🔍 호기심 탐험대원',
        badge: 'LV.3 호기심',
        level: 3,
        progressPercent: 60,
        message: '벌써 2개 층을 정복했어요! 절반 성공!',
      };
    case 3:
      return {
        title: '🗺️ 베테랑 탐험대원',
        badge: 'LV.4 베테랑',
        level: 4,
        progressPercent: 65,
        message: '3개 층을 정복했어요! 이제 두 층만 더 탐험해 보세요!',
      };
    case 4:
      return {
        title: '🧭 마스터 후보 탐험대원',
        badge: 'LV.5 마스터 후보',
        level: 5,
        progressPercent: 85,
        message: '마지막 1개 층만 더 방문하면 명예 박사 달성!',
      };
    case 5:
    default:
      return {
        title: '🏆 학교 명예 탐험 박사',
        badge: 'LV.MAX 명예 박사',
        level: 6,
        progressPercent: 100,
        message: '전 층 탐험 완수! 우리 학교 최고의 탐험 박사입니다! 🎉',
      };
  }
}
