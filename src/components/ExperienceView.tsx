import React, { useState } from 'react';
import { SpaceItem, FloorNumber, StudentCharacter, SpaceComment, CommentReaction } from '../types';
import { FLOOR_CONFIGS } from '../data/defaultSpaces';
import { CharacterAvatar } from './CharacterAvatar';
import { CertificateModal } from './CertificateModal';
import { 
  BUDDY_LIST, 
  HEADWEAR_LIST, 
  TOOL_ITEM_LIST, 
  THEME_COLOR_CONFIG, 
  getExplorerRank 
} from '../data/characterData';
import { 
  Search, 
  PlusCircle, 
  Heart, 
  CheckCircle, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Compass,
  Star,
  Camera,
  Palette,
  Check,
  Trophy,
  MessageSquare,
  Send,
  Trash2,
  Smile,
  BookOpen
} from 'lucide-react';
import imgCutaway from '../assets/images/school_building_cutaway_1790480486892.jpg';

interface ExperienceViewProps {
  spaces: SpaceItem[];
  onOpenSpaceDetail: (space: SpaceItem) => void;
  onGoToBuildForFloor: (floor: FloorNumber) => void;
  onLikeSpace: (id: string) => void;
  visitedStampIds: string[];
  character: StudentCharacter;
  onOpenCharacterCustomizer: () => void;
  comments?: SpaceComment[];
  onAddComment?: (spaceId: string, content: string, reactionTag?: CommentReaction, spaceName?: string, floor?: FloorNumber) => void;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({
  spaces,
  onOpenSpaceDetail,
  onGoToBuildForFloor,
  onLikeSpace,
  visitedStampIds,
  character,
  onOpenCharacterCustomizer,
  comments = [],
  onAddComment,
  onLikeComment,
  onDeleteComment,
}) => {
  const [selectedFloor, setSelectedFloor] = useState<FloorNumber | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [guestbookFilter, setGuestbookFilter] = useState<'all' | '1' | '2' | '3' | '4' | 'general'>('all');
  const [guestbookText, setGuestbookText] = useState('');
  const [guestbookReaction, setGuestbookReaction] = useState<CommentReaction>('💖 추천해요');

  // Filter approved spaces only for experience view
  const approvedSpaces = spaces.filter((s) => s.status === 'approved');

  // Filter by floor and search query
  const filteredSpaces = approvedSpaces.filter((space) => {
    const matchesFloor = selectedFloor === 'all' || space.floor === selectedFloor;
    const matchesQuery =
      searchQuery.trim() === '' ||
      space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.oneLineIntro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.specialPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFloor && matchesQuery;
  });

  const currentFloorConfig =
    selectedFloor !== 'all'
      ? FLOOR_CONFIGS.find((f) => f.floor === selectedFloor)
      : null;

  // Calculate floor exploration stamps (check if visitor stamped at least 1 place in each floor)
  const floorStampedMap: Record<number, boolean> = {
    1: approvedSpaces.filter((s) => s.floor === 1).some((s) => visitedStampIds.includes(s.id)),
    2: approvedSpaces.filter((s) => s.floor === 2).some((s) => visitedStampIds.includes(s.id)),
    3: approvedSpaces.filter((s) => s.floor === 3).some((s) => visitedStampIds.includes(s.id)),
    4: approvedSpaces.filter((s) => s.floor === 4).some((s) => visitedStampIds.includes(s.id)),
  };
  const stampedFloorCount = Object.values(floorStampedMap).filter(Boolean).length;
  const isMasterExplorer = stampedFloorCount === 4;

  const currentBuddy = BUDDY_LIST.find((b) => b.id === character.buddyId) || BUDDY_LIST[0];
  const currentHeadwear = HEADWEAR_LIST.find((h) => h.id === character.headwear) || HEADWEAR_LIST[0];
  const currentTool = TOOL_ITEM_LIST.find((t) => t.id === character.toolItem) || TOOL_ITEM_LIST[0];
  const currentTheme = THEME_COLOR_CONFIG[character.themeColor];
  const rankInfo = getExplorerRank(stampedFloorCount);

  // Filter guestbook comments
  const filteredComments = comments.filter((c) => {
    if (guestbookFilter === 'all') return true;
    if (guestbookFilter === 'general') return c.spaceId === 'general';
    return c.floor === Number(guestbookFilter);
  });

  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestbookText.trim() || !onAddComment) return;
    onAddComment('general', guestbookText.trim(), guestbookReaction, '학교 전체 방명록');
    setGuestbookText('');
  };

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Colorful Animated Hero Section with Personalized Student Avatar */}
      <section className="relative overflow-hidden rounded-3xl sm:rounded-[36px] bg-gradient-to-br from-amber-300 via-amber-200 to-emerald-200 border-4 border-amber-300 shadow-xl p-6 sm:p-10">
        {/* Floating Doodles Background */}
        <div className="absolute top-3 left-6 text-3xl opacity-30 select-none animate-pulse">✏️</div>
        <div className="absolute top-12 right-12 text-4xl opacity-30 select-none animate-bounce">⭐</div>
        <div className="absolute bottom-6 left-1/3 text-3xl opacity-25 select-none">🎨</div>
        <div className="absolute bottom-4 right-1/4 text-3xl opacity-30 select-none">🚀</div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-slate-900">
            {/* Mascot Greeting Pill with Student's Name and Custom Avatar */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-xs border-2 border-amber-300 shadow-xs max-w-full">
              <div className="w-8 h-8 rounded-xl bg-white border border-amber-300 shadow-2xs overflow-hidden flex items-center justify-center shrink-0">
                <CharacterAvatar
                  buddyId={character.buddyId}
                  outfit={character.outfit}
                  headwear={character.headwear}
                  toolItem={character.toolItem}
                  expression={character.expression}
                  themeColor={character.themeColor}
                  size={32}
                  showAura={false}
                  animate={false}
                />
              </div>
              <span className="font-jua text-xs sm:text-sm text-amber-950 truncate">
                "안녕, <strong className="text-emerald-800">{character.name}</strong> 대원! {currentHeadwear.emoji} {currentTool.name}(으)로 학교 보물을 찾아보자!"
              </span>
              <button
                onClick={onOpenCharacterCustomizer}
                className="font-jua text-[11px] text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300 transition-colors shrink-0 cursor-pointer"
              >
                꾸미기 🎨
              </button>
            </div>

            {/* 1. Primary Display Title (첫 번째 제목): 우리 학교 공간 탐험대 */}
            <div className="space-y-3">
              <h1 className="font-jua text-3xl sm:text-5xl lg:text-6xl text-slate-950 tracking-tight leading-tight flex items-center flex-wrap gap-2.5">
                <span className="drop-shadow-xs">우리 학교 공간 탐험대</span>
                <span className="text-3xl sm:text-5xl lg:text-6xl">🏫🎒</span>
              </h1>

              {/* 2. Super High-Visibility Key Phrase: 우리가 직접 찍고 꾸미는 우리 학교! */}
              <div>
                <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-white/95 border-3 border-amber-400 shadow-md">
                  <span className="text-xl sm:text-2xl shrink-0">📸</span>
                  <span className="font-jua text-lg sm:text-2xl md:text-3xl text-emerald-800 tracking-tight whitespace-nowrap font-extrabold">
                    우리가 직접 찍고 꾸미는 우리 학교!
                  </span>
                  <span className="text-xl sm:text-2xl shrink-0">🎨</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed max-w-xl">
              1층 도서관부터 4층 체육관까지! 친구들이 직접 찰칵 찍은 사진과 비밀 꿀팁을 구경해보세요.
              마음에 쏙 드는 장소에 <strong>[방문 도장 쾅! 💮]</strong>을 찍으면 내 캐릭터의 탐험대 등급이 쑥쑥 올라갑니다.
            </p>

            {/* Call to Actions */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  const target = document.getElementById('stamp-passport-anchor');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-jua inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs sm:text-base shadow-lg transition-all hover:scale-103 whitespace-nowrap"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                <span>내 스탬프 수첩 보기 ({stampedFloorCount}/4)</span>
              </button>

              <button
                onClick={onOpenCharacterCustomizer}
                className="font-jua inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs sm:text-base shadow-md transition-all hover:scale-103 border-2 border-amber-500 whitespace-nowrap"
              >
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>내 캐릭터 꾸미기 🎨</span>
              </button>

              <button
                onClick={() => onGoToBuildForFloor(1)}
                className="font-jua inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-base shadow-md transition-all hover:scale-103 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200 shrink-0" />
                <span>우리 모둠도 소개글 쓰기 ✏️</span>
              </button>
            </div>
          </div>

          {/* Right Visual: 3D School Building Cutaway Card */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white aspect-4/3 sm:aspect-16/10">
              <img
                src={imgCutaway}
                alt="우리 학교 4층 입체 단면도"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {/* Floor Quick Badges on the image */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-jua">
                <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-xl shadow-xs">
                  🏫 4층 건물 한눈에 보기
                </span>
                <span className="bg-black/60 px-2 py-1 rounded-xl backdrop-blur-xs font-mono">
                  총 {approvedSpaces.length}개 보물 등록됨
                </span>
              </div>
            </div>

            {/* Floating Student Character Badge */}
            <div
              onClick={onOpenCharacterCustomizer}
              className="absolute -top-3 -right-3 bg-white p-2 rounded-2xl shadow-xl rotate-3 flex items-center gap-2 border-3 border-amber-400 cursor-pointer hover:scale-105 transition-transform"
              title="클릭하여 내 캐릭터를 꾸며보세요!"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                <CharacterAvatar
                  buddyId={character.buddyId}
                  outfit={character.outfit}
                  headwear={character.headwear}
                  toolItem={character.toolItem}
                  expression={character.expression}
                  themeColor={character.themeColor}
                  size={38}
                  showAura={false}
                  animate={false}
                />
              </div>
              <div className="text-left font-jua">
                <div className="text-[11px] text-amber-800">{rankInfo.badge}</div>
                <div className="text-xs text-slate-900 leading-none">{character.name} 대원</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Building Cross-Section (4층 건물 입체 단면 탐험대) */}
      <section id="explore-anchor" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛗</span>
              <h2 className="font-jua text-2xl sm:text-3xl text-slate-900">
                층별 엘리베이터 타고 탐험하기
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              가고 싶은 층 버튼을 꾹 누르면 그 층의 멋진 장소들만 쏙 모아서 보여줘요!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setSelectedFloor('all')}
              className={`font-jua px-4 py-2 rounded-2xl text-xs sm:text-sm border-2 transition-all ${
                selectedFloor === 'all'
                  ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-md ring-2 ring-slate-900/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              🌈 모든 층 다 볼래요! ({approvedSpaces.length}곳)
            </button>
          </div>
        </div>

        {/* 4-Story Building Interactive Block Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              floor: 4 as FloorNumber,
              emoji: '🏀',
              title: '신나는 체육관 & 방송실',
              desc: '비가 와도 신나게 공놀이하는 넓은 강당과 방송 스튜디오',
              accentLight: 'from-purple-500 to-indigo-600',
              tag: '어울림 체육관',
            },
            {
              floor: 3 as FloorNumber,
              emoji: '🔬',
              title: '신기한 과학실 & 미술실',
              desc: '현미경으로 세포를 관찰하고 물감으로 꿈을 그리는 특별실',
              accentLight: 'from-amber-400 to-amber-500',
              tag: '별누리 과학실',
            },
            {
              floor: 2 as FloorNumber,
              emoji: '💻',
              title: '재미있는 컴퓨터 & 메이커실',
              desc: '엔트리 코딩과 3D 프린터로 내 작품이 탄생하는 미래 교실',
              accentLight: 'from-sky-400 to-blue-500',
              tag: '무한상상 메이커',
            },
            {
              floor: 1 as FloorNumber,
              emoji: '📚',
              title: '따뜻한 도서관 & 보건실',
              desc: '만화책과 동화책이 가득하고 아플 때 치료해주는 쉼터',
              accentLight: 'from-emerald-400 to-teal-500',
              tag: '글벗나래 도서관',
            },
          ].map((item) => {
            const isSelected = selectedFloor === item.floor;
            const floorSpaces = approvedSpaces.filter((s) => s.floor === item.floor);
            const isFloorStamped = floorStampedMap[item.floor];

            return (
              <button
                key={item.floor}
                onClick={() => setSelectedFloor(item.floor)}
                className={`p-5 rounded-3xl border-3 text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? `bg-gradient-to-br ${item.accentLight} text-white border-slate-900 shadow-xl scale-102 ring-4 ring-amber-300`
                    : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400 hover:shadow-md hover:bg-amber-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl p-1 rounded-2xl bg-white/20 backdrop-blur-xs shadow-2xs">
                      {item.emoji}
                    </span>
                    <span className={`font-jua text-xl sm:text-2xl ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {item.floor}층
                    </span>
                  </div>

                  <span
                    className={`font-jua text-xs px-2.5 py-1 rounded-xl font-bold whitespace-nowrap ${
                      isSelected
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-amber-100'
                    }`}
                  >
                    {floorSpaces.length}곳 등록
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className={`font-jua text-sm sm:text-base font-bold whitespace-nowrap truncate ${isSelected ? 'text-amber-200' : 'text-slate-900'}`}>
                    {item.title}
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-black/10 flex items-center justify-between text-[11px] font-jua">
                  <span className={isSelected ? 'text-white/80' : 'text-slate-400'}>
                    추천: {item.tag}
                  </span>
                  {isFloorStamped ? (
                    <span className="text-emerald-700 bg-white px-2 py-0.5 rounded-lg font-bold shadow-2xs flex items-center gap-1">
                      💮 스탬프 완료!
                    </span>
                  ) : (
                    <span className={isSelected ? 'text-amber-200' : 'text-amber-700'}>
                      도장 미획득 🏃
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Deep Character & Stamp Mission Integration: [🎒 나의 학교 탐험대 스탬프 수첩] */}
      <section id="stamp-passport-anchor" className="bg-white rounded-3xl sm:rounded-[36px] border-4 border-amber-300 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-amber-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-2xs shrink-0">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-jua text-2xl text-slate-950">
                  {character.name} 대원의 탐험 스탬프 수첩
                </h3>
                <span className="font-jua text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {stampedFloorCount} / 4개 층 완수!
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                각 층의 공간 상세 화면에서 <strong>[나도 가봤어요! 도장 쾅 🪪]</strong>을 누르면 내 캐릭터 신분증에 도장이 찍혀요!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenCharacterCustomizer}
              className="font-jua inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs sm:text-sm shadow-xs border-2 border-amber-500 transition-transform hover:scale-102"
            >
              <Palette className="w-4 h-4" />
              <span>내 캐릭터 & 장비 꾸미기</span>
            </button>

            {isMasterExplorer && (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="font-jua inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm shadow-md animate-bounce"
              >
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>명예 박사 훈장 보기! 🏆</span>
              </button>
            )}
          </div>
        </div>

        {/* Two-Column Passport: Left Character Card + Right 4-Floor Stamps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Customized Character Explorer ID Card (4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-3xl border-3 border-amber-300 p-5 space-y-4 shadow-2xs relative">
            <div className="flex items-center justify-between text-xs font-jua">
              <span className="text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-lg">
                대원 신분증
              </span>
              <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                {rankInfo.badge}
              </span>
            </div>

            {/* Character Picture with Fully Layered Avatar */}
            <div 
              onClick={onOpenCharacterCustomizer}
              className="relative mx-auto w-32 h-36 rounded-3xl bg-white/95 border-3 border-white shadow-md flex items-center justify-center cursor-pointer group hover:scale-102 transition-transform"
              title="클릭하여 내 캐릭터 옷과 아이템 바꾸기"
            >
              <CharacterAvatar
                buddyId={character.buddyId}
                outfit={character.outfit}
                headwear={character.headwear}
                toolItem={character.toolItem}
                expression={character.expression}
                themeColor={character.themeColor}
                size={120}
                hasHonorMedal={isMasterExplorer}
                animate={true}
              />
              <div className="absolute bottom-1 right-2 text-[10px] font-jua text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-md border border-amber-200">
                코디 변경 🎨
              </div>
            </div>

            {/* Character Identity */}
            <div className="text-center space-y-1">
              <div className="font-jua text-xl text-slate-950">
                {character.name}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {character.gradeClass} · 단짝: {currentBuddy.name} {currentBuddy.emoji}
              </div>
              <div className="font-jua text-xs text-emerald-800 bg-white/80 py-1 px-2.5 rounded-xl border border-amber-200 mt-1 inline-block">
                {rankInfo.title}
              </div>
            </div>

            {/* Level Progress Bar connected to stamps */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-jua text-slate-600">
                <span>탐험 퀘스트 진행도</span>
                <span className="text-emerald-700">{stampedFloorCount} / 4개 층</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${rankInfo.progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 text-center font-medium mt-0.5">
                {rankInfo.message}
              </p>
            </div>
          </div>

          {/* Right: 4-Floor Stamps Interactive Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  floor: 1 as FloorNumber,
                  name: '1층 지혜의 스탬프',
                  place: '글벗나래 도서관 & 보건실',
                  emoji: '📚',
                  color: 'border-emerald-300 bg-emerald-50',
                  sealText: '1F 지혜 💮',
                },
                {
                  floor: 2 as FloorNumber,
                  name: '2층 상상의 스탬프',
                  place: '무한상상 메이커 & 컴퓨터실',
                  emoji: '💻',
                  color: 'border-sky-300 bg-sky-50',
                  sealText: '2F 상상 💮',
                },
                {
                  floor: 3 as FloorNumber,
                  name: '3층 탐구의 스탬프',
                  place: '별누리 과학실 & 미술실',
                  emoji: '🔬',
                  color: 'border-amber-300 bg-amber-50',
                  sealText: '3F 탐구 💮',
                },
                {
                  floor: 4 as FloorNumber,
                  name: '4층 활력의 스탬프',
                  place: '어울림 체육관 & 방송실',
                  emoji: '🏀',
                  color: 'border-purple-300 bg-purple-50',
                  sealText: '4F 활력 💮',
                },
              ].map((slot) => {
                const isStamped = floorStampedMap[slot.floor];
                return (
                  <div
                    key={slot.floor}
                    onClick={() => {
                      if (!isStamped) {
                        setSelectedFloor(slot.floor);
                        const cardGrid = document.getElementById('explore-anchor');
                        cardGrid?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`p-4 rounded-3xl border-3 flex items-center justify-between transition-all cursor-pointer ${
                      isStamped
                        ? `${slot.color} shadow-sm scale-101 ring-2 ring-emerald-200`
                        : 'bg-slate-50 border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 font-bold ${
                          isStamped
                            ? 'bg-white shadow-xs border-2 border-emerald-400 text-emerald-600'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isStamped ? '💮' : slot.emoji}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="font-jua text-sm sm:text-base text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
                          <span>{slot.name}</span>
                          {isStamped && (
                            <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono shrink-0">
                              획득!
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium whitespace-nowrap truncate">
                          {slot.place}
                        </p>
                      </div>
                    </div>

                    {/* Seal Badge */}
                    <div className="shrink-0 text-right">
                      {isStamped ? (
                        <div className="font-jua text-xs text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{slot.sealText}</span>
                        </div>
                      ) : (
                        <span className="font-jua text-xs text-amber-700 bg-white/80 px-2 py-1 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors">
                          도장 찍으러 가기 →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Master Explorer Celebration Banner */}
            {isMasterExplorer && (
              <div className="p-4 bg-gradient-to-r from-amber-200 via-amber-300 to-emerald-200 rounded-3xl border-3 border-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="text-3xl animate-bounce">🏆</div>
                  <div>
                    <h4 className="font-jua text-base sm:text-lg text-slate-950">
                      축하합니다! 4개 층 보물 도장을 모두 모았습니다!
                    </h4>
                    <p className="text-xs text-slate-800 font-medium">
                      {character.name} 대원은 우리 학교의 자랑스러운 [학교 명예 탐험 박사]입니다!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="font-jua px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-2xl text-xs sm:text-sm shadow-md transition-all shrink-0 self-start sm:self-auto"
                >
                  수료 훈장 보기 🎓
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Search & Filter Bar */}
      <section className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="어떤 공간이 궁금한가요? (예: 도서관, 과학실, 컴퓨터실, 체육관, 3학년...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 text-sm sm:text-base bg-white rounded-2xl border-3 border-amber-200 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 font-medium transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="font-jua absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-lg"
            >
              지우기
            </button>
          )}
        </div>

        {/* Selected Floor Callout Alert */}
        {currentFloorConfig && (
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border-3 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <span className="font-jua text-lg sm:text-xl text-amber-950 block">
                📍 {currentFloorConfig.name}
              </span>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                {currentFloorConfig.description}
              </p>
            </div>
            <button
              onClick={() => onGoToBuildForFloor(currentFloorConfig.floor)}
              className="font-jua inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-sm transition-all hover:scale-102 shrink-0 self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{currentFloorConfig.floor}층에 새 장소 추가하기! ✏️</span>
            </button>
          </div>
        )}
      </section>

      {/* 5. Space Cards Grid (쇼핑몰 상품 구경하듯 카드로 구성) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-jua text-2xl text-slate-900 flex items-center gap-2">
            <span>✨</span>
            <span>
              {selectedFloor === 'all'
                ? '모든 층 공간 모음'
                : `${selectedFloor}층에 있는 멋진 공간들`}
            </span>
          </h2>
          <span className="font-jua text-xs text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-200">
            총 <strong className="text-emerald-700 font-mono text-sm">{filteredSpaces.length}</strong>곳
          </span>
        </div>

        {filteredSpaces.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border-3 border-dashed border-amber-300 space-y-3">
            <div className="text-4xl animate-bounce">🔍</div>
            <p className="font-jua text-xl text-slate-800">
              아직 등록된 장소가 없거나 검색 결과가 없어요!
            </p>
            <p className="text-xs text-slate-500 font-medium">
              우리 모둠이 이 층의 멋진 장소를 첫 번째로 소개해보는 건 어떨까요?
            </p>
            <button
              onClick={() => onGoToBuildForFloor(selectedFloor === 'all' ? 1 : selectedFloor)}
              className="font-jua inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-2xl transition-all shadow-md hover:scale-103 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새로운 장소 등록하러 가기 ✏️</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => {
              const isVisited = visitedStampIds.includes(space.id);
              const firstImage = space.images && space.images.length > 0 ? space.images[0] : null;

              return (
                <div
                  key={space.id}
                  onClick={() => onOpenSpaceDetail(space)}
                  className="group bg-white rounded-3xl border-3 border-amber-100 hover:border-amber-400 hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-1.5"
                >
                  {/* Card Cover Image */}
                  <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={space.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <MapPin className="w-10 h-10 stroke-1 mb-1" />
                        <span className="text-xs font-bold font-jua">사진 준비 중</span>
                      </div>
                    )}

                    {/* Floor Label Badge */}
                    <div className="font-jua absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-xs text-white text-xs shadow-xs">
                      {space.floor}층
                    </div>

                    {/* Example badge */}
                    {space.isTemplateExample && (
                      <div className="font-jua absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs shadow-xs flex items-center gap-1 border border-amber-300">
                        <Star className="w-3 h-3 fill-slate-950" />
                        <span>모범 예시</span>
                      </div>
                    )}

                    {/* Visited stamp tag with student character name */}
                    {isVisited && (
                      <div className="font-jua absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs flex items-center gap-1 shadow-md animate-in zoom-in-95">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>도장 획득 완료! 💮</span>
                      </div>
                    )}

                    {/* Multiple Photos Indicator */}
                    {space.images.length > 1 && (
                      <div className="font-jua absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 text-white text-xs backdrop-blur-xs flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5" />
                        <span>사진 {space.images.length}장</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-jua text-xl text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {space.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                        {space.oneLineIntro}
                      </p>
                    </div>

                    {/* Author, Likes & Comments Footer */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="truncate max-w-[120px] font-bold text-slate-700" title={space.author}>
                        👦 {space.author}
                      </span>
                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Space Comment Count */}
                        <div className="flex items-center gap-1 text-slate-500 font-bold font-jua">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                          <span className="font-mono text-xs">
                            {comments.filter((c) => c.spaceId === space.id).length}
                          </span>
                        </div>

                        {/* Likes */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLikeSpace(space.id);
                          }}
                          className="flex items-center gap-1 text-slate-600 hover:text-rose-500 transition-colors font-bold font-jua"
                        >
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          <span className="font-mono text-xs">{space.likes}</span>
                        </button>

                        <span className="font-jua flex items-center text-emerald-700 group-hover:translate-x-1 transition-transform">
                          자세히 보기 <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Card for Students */}
            <div
              onClick={() => onGoToBuildForFloor(selectedFloor === 'all' ? 1 : selectedFloor)}
              className="bg-amber-50/60 hover:bg-amber-100/70 rounded-3xl border-3 border-dashed border-amber-300 hover:border-amber-400 transition-all p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px] group shadow-2xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-amber-600 shadow-2xs group-hover:scale-110 transition-transform mb-3">
                <PlusCircle className="w-8 h-8" />
              </div>
              <h3 className="font-jua text-lg text-slate-900 group-hover:text-amber-950">
                {selectedFloor === 'all'
                  ? '우리 모둠의 특별한 공간 소개하기'
                  : `${selectedFloor}층의 새로운 공간 추가하기`}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 max-w-[220px] leading-relaxed">
                직접 찍은 사진 여러 장과 우리만의 꿀팁을 올려보세요!
              </p>
              <span className="font-jua mt-4 px-4 py-2 text-xs font-bold text-amber-950 bg-amber-400 rounded-xl shadow-xs group-hover:bg-amber-500 transition-colors">
                소개글 쓰러 가기 ✏️
              </span>
            </div>
          </div>
        )}
      </section>

      {/* 6. School Exploration Guestbook (우리 학교 탐험대 방명록 & 소감 나눔터) */}
      <section className="bg-white rounded-3xl sm:rounded-[36px] border-4 border-amber-300 p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-2xs shrink-0">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-jua text-2xl text-slate-950">
                  우리 학교 탐험대 방명록 & 한마디
                </h2>
                <span className="font-jua text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  총 {comments.length}개
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                탐험을 마친 소감, 친구들에게 알려주고 싶은 비밀 꿀팁, 응원의 메시지를 자유롭게 남겨보세요!
              </p>
            </div>
          </div>

          {/* Guestbook Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 self-start sm:self-auto">
            {[
              { id: 'all', label: '전체 글' },
              { id: 'general', label: '🏫 학교 방명록' },
              { id: '1', label: '1층 📚' },
              { id: '2', label: '2층 💻' },
              { id: '3', label: '3층 🔬' },
              { id: '4', label: '4층 🏀' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGuestbookFilter(tab.id as any)}
                className={`font-jua px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                  guestbookFilter === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-bold border border-amber-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guestbook Write Form */}
        <form onSubmit={handleGuestbookSubmit} className="bg-gradient-to-r from-amber-50 to-orange-50/60 p-4 sm:p-5 rounded-3xl border-2 border-amber-200 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white border border-amber-300 overflow-hidden flex items-center justify-center shrink-0">
                <CharacterAvatar
                  buddyId={character.buddyId}
                  outfit={character.outfit}
                  headwear={character.headwear}
                  toolItem={character.toolItem}
                  expression={character.expression}
                  themeColor={character.themeColor}
                  size={30}
                  showAura={false}
                  animate={false}
                />
              </div>
              <span className="font-jua text-xs sm:text-sm text-slate-900">
                <strong>{character.gradeClass} {character.name}</strong> 대원의 학교 방명록 남기기:
              </span>
            </div>

            {/* Reaction tag selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['💖 추천해요', '👍 최고예요', '📸 사진 멋져요', '💡 꿀팁 감사', '🏃 꼭 가볼래요', '✨ 예뻐요'] as CommentReaction[]).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setGuestbookReaction(tag)}
                  className={`font-jua text-xs px-2.5 py-1 rounded-xl border transition-all ${
                    guestbookReaction === tag
                      ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-2xs scale-103'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={guestbookText}
              onChange={(e) => setGuestbookText(e.target.value)}
              placeholder="예) 1층부터 4층까지 스탬프 다 모았어요! 4층 체육관이 제일 멋져요 🏫✨"
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-white border-2 border-amber-200 rounded-2xl focus:outline-none focus:border-amber-400 font-medium shadow-2xs"
            />
            <button
              type="submit"
              disabled={!guestbookText.trim()}
              className="font-jua inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm shadow-md transition-all hover:scale-103 disabled:opacity-40 shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>방명록 남기기 📝</span>
            </button>
          </div>
        </form>

        {/* Guestbook Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
          {filteredComments.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-amber-50/40 rounded-3xl border border-dashed border-amber-300 space-y-1">
              <p className="font-jua text-base text-slate-800">
                해당 층에 작성된 방명록이 아직 없어요!
              </p>
              <p className="text-xs text-slate-500">
                위 입력창에 첫 번째 탐험 소감이나 꿀팁을 남겨보세요 ✏️
              </p>
            </div>
          ) : (
            filteredComments.map((comment) => {
              const matchedSpace = spaces.find((s) => s.id === comment.spaceId);

              return (
                <div
                  key={comment.id}
                  className="bg-slate-50/80 hover:bg-amber-50/50 p-4 rounded-3xl border-2 border-amber-100 hover:border-amber-300 transition-all space-y-2.5 shadow-2xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-amber-300 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                          <CharacterAvatar
                            buddyId={comment.avatar.buddyId}
                            outfit={comment.avatar.outfit}
                            headwear={comment.avatar.headwear}
                            toolItem={comment.avatar.toolItem}
                            expression={comment.avatar.expression}
                            themeColor={comment.avatar.themeColor}
                            size={34}
                            showAura={false}
                            animate={false}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-jua text-xs sm:text-sm text-slate-900 truncate">
                            {comment.authorName} <span className="text-[11px] text-slate-500 font-normal">({comment.authorGradeClass})</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400">
                            {comment.spaceName && (
                              <span
                                onClick={() => matchedSpace && onOpenSpaceDetail(matchedSpace)}
                                className={`font-jua px-1.5 py-0.2 rounded ${
                                  matchedSpace ? 'bg-amber-100 text-amber-900 cursor-pointer hover:underline' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                📍 {comment.spaceName}
                              </span>
                            )}
                            <span>· {new Date(comment.createdAt).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      {comment.reactionTag && (
                        <span className="font-jua text-[11px] bg-white text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-xl shadow-2xs shrink-0">
                          {comment.reactionTag}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-white/70 p-3 rounded-2xl border border-slate-100">
                      "{comment.content}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => onLikeComment && onLikeComment(comment.id)}
                      className="font-jua inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>공감해요 {comment.likes}</span>
                    </button>

                    {onDeleteComment && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                        title="댓글 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Official Master Explorer Certificate Modal with Save as Image & Print */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        character={character}
        visitedStampIds={visitedStampIds}
        spaces={spaces}
      />
    </div>
  );
};
