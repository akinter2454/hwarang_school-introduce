import React, { useState, useEffect } from 'react';
import { SpaceItem, StudentCharacter, SpaceComment, CommentReaction, FloorNumber } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  CheckCircle, 
  Edit3, 
  MapPin, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Info,
  User,
  Share2,
  Volume2,
  VolumeX,
  Award,
  MessageSquare,
  Send,
  Trash2,
  Smile
} from 'lucide-react';

interface SpaceDetailModalProps {
  space: SpaceItem | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onToggleStamp: (id: string) => void;
  isStamped: boolean;
  onEdit: (space: SpaceItem) => void;
  characterName?: string;
  character?: StudentCharacter;
  comments?: SpaceComment[];
  onAddComment?: (spaceId: string, content: string, reactionTag?: CommentReaction, spaceName?: string, floor?: FloorNumber) => void;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export const SpaceDetailModal: React.FC<SpaceDetailModalProps> = ({
  space,
  onClose,
  onLike,
  onToggleStamp,
  isStamped,
  onEdit,
  characterName,
  character,
  comments = [],
  onAddComment,
  onLikeComment,
  onDeleteComment,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<CommentReaction>('👍 최고예요');

  // Filter comments for this space
  const spaceComments = comments.filter((c) => c.spaceId === space?.id);

  // Reset image index when modal opens or space changes
  useEffect(() => {
    setActiveImageIndex(0);
    setCommentText('');
    // Stop speech synthesis when space changes
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [space?.id]);

  if (!space) return null;

  const images = space.images && space.images.length > 0 ? space.images : [];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !onAddComment) return;
    onAddComment(space.id, commentText.trim(), selectedReaction, space.name, space.floor);
    setCommentText('');
  };

  // Text to Speech for Elementary Kids
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('이 브라우저는 음성 읽어주기를 지원하지 않아요.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${space.name}. ${space.oneLineIntro}. 이곳에서는 무엇을 하나요? ${space.description}. 특별한 점: ${space.specialPoint}. 언제, 어떻게 이용하나요? ${space.usageGuide}. 지켜야 할 약속: ${space.rules}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95; // slightly slower for elementary kids
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onClose();
  };

  const floorColors = {
    1: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    2: 'bg-sky-100 text-sky-800 border-sky-300',
    3: 'bg-amber-100 text-amber-800 border-amber-300',
    4: 'bg-purple-100 text-purple-800 border-purple-300',
  }[space.floor];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border-2 border-amber-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <span className={`font-jua px-3 py-1 text-xs rounded-xl border ${floorColors}`}>
              {space.floor}층 공간
            </span>
            <h2 className="font-jua text-xl sm:text-2xl text-slate-900 truncate">
              {space.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Audio TTS button */}
            <button
              onClick={handleToggleSpeech}
              className={`font-jua flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl transition-all ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
              title="친구의 소개글을 소리로 들어보세요"
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>소리 멈추기</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  <span>소리로 듣기 🔊</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                handleClose();
                onEdit(space);
              }}
              className="font-jua flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors border border-emerald-300"
              title="학생이 이 내용을 직접 수정할 수 있습니다"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>수정하기</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="링크 복사"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">
          {copied && (
            <div className="p-3 bg-emerald-50 text-emerald-900 text-xs font-bold text-center rounded-2xl border-2 border-emerald-200">
              링크가 복사되었어요! 친구에게 공유해보세요! 📋
            </div>
          )}

          {/* Child-Friendly Photo Gallery & Slider */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 bg-slate-900 rounded-3xl overflow-hidden group shadow-inner">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]}
                  alt={`${space.name} 사진 ${activeImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <MapPin className="w-12 h-12 mb-2 stroke-1" />
                  <p className="text-sm font-bold">등록된 사진이 없어요.</p>
                </div>
              )}

              {/* Slider Arrows (Large and easy to click for kids) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-all hover:scale-105"
                    aria-label="이전 사진 보기"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-all hover:scale-105"
                    aria-label="다음 사진 보기"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs font-bold font-mono backdrop-blur-xs">
                    📸 사진 {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip with Indicator */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 p-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 h-16 rounded-xl overflow-hidden shrink-0 border-3 transition-all ${
                      activeImageIndex === idx
                        ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-300'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`사진 ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] px-1 font-mono">
                      {idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* One-line Intro Callout */}
          <div className="p-4 sm:p-5 bg-amber-50/70 rounded-3xl border-l-6 border-amber-400 text-slate-800 shadow-2xs">
            <p className="font-jua text-base sm:text-xl leading-relaxed text-slate-900">
              "{space.oneLineIntro}"
            </p>
          </div>

          {/* Child-Friendly Q&A Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. 이곳에서는 무엇을 하나요? */}
            <div className="p-5 bg-white rounded-3xl border-2 border-slate-100 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-jua text-base sm:text-lg">
                <span className="text-xl">📖</span>
                <span>이곳에서는 무엇을 하나요?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {space.description}
              </p>
            </div>

            {/* 2. 친구들에게 자랑하고 싶은 특별한 점 */}
            <div className="p-5 bg-white rounded-3xl border-2 border-amber-100 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-jua text-base sm:text-lg">
                <span className="text-xl">🌟</span>
                <span>친구들에게 자랑하고 싶은 특별한 점!</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {space.specialPoint}
              </p>
            </div>

            {/* 3. 언제, 어떻게 갈 수 있나요? */}
            <div className="p-5 bg-white rounded-3xl border-2 border-sky-100 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-jua text-base sm:text-lg">
                <span className="text-xl">⏰</span>
                <span>언제, 어떻게 이용할 수 있나요?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {space.usageGuide}
              </p>
            </div>

            {/* 4. 이곳에서 지켜야 할 약속 */}
            <div className="p-5 bg-white rounded-3xl border-2 border-rose-100 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-jua text-base sm:text-lg">
                <span className="text-xl">🤝</span>
                <span>이곳에서 지켜야 할 약속</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                {space.rules}
              </p>
            </div>
          </div>

          {/* Author info & Metadata */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>소개한 친구: <strong className="text-slate-900 font-bold">{space.author}</strong></span>
              {space.studentGroup && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>모둠: <strong className="text-slate-900 font-bold">{space.studentGroup}</strong></span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>위치: {space.floor}층</span>
              <span aria-hidden="true">·</span>
              <span>작성일: {new Date(space.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          {/* Place Comments & Exploration Reviews Section */}
          <div className="p-5 sm:p-6 bg-amber-50/50 rounded-3xl border-2 border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <h3 className="font-jua text-base sm:text-lg text-slate-900">
                  대원들의 방명록 & 생생 후기 ({spaceComments.length})
                </h3>
              </div>
              <span className="text-xs font-jua text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl">
                💬 꿀팁과 감상을 나눠요!
              </span>
            </div>

            {/* Comment Submission Form */}
            {character && (
              <form onSubmit={handleSubmitComment} className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-2xs space-y-3">
                {/* Character Author Header & Reaction Pill Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-300 overflow-hidden flex items-center justify-center shrink-0">
                      <CharacterAvatar
                        buddyId={character.buddyId}
                        outfit={character.outfit}
                        headwear={character.headwear}
                        toolItem={character.toolItem}
                        expression={character.expression}
                        themeColor={character.themeColor}
                        size={26}
                        showAura={false}
                        animate={false}
                      />
                    </div>
                    <span className="font-jua text-xs sm:text-sm text-slate-900">
                      <strong>{character.gradeClass} {character.name}</strong> 대원의 한마디:
                    </span>
                  </div>

                  {/* Reaction Tag Selection */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['👍 최고예요', '📸 사진 멋져요', '💡 꿀팁 감사', '🏃 꼭 가볼래요', '💖 추천해요'] as CommentReaction[]).map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setSelectedReaction(tag)}
                        className={`font-jua text-[11px] px-2 py-0.5 rounded-lg border transition-all ${
                          selectedReaction === tag
                            ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold shadow-2xs scale-103'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Text & Submit */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="이 장소에 대해 느낀 점이나 친구들에게 알려주고 싶은 꿀팁을 적어보세요!"
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="font-jua inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all disabled:opacity-40 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>등록</span>
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            {spaceComments.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-dashed border-amber-200 text-center space-y-1">
                <p className="font-jua text-sm text-slate-700">
                  아직 작성된 방명록 댓글이 없어요!
                </p>
                <p className="text-xs text-slate-500">
                  첫 번째로 이 장소에 대한 감상평이나 응원 댓글을 남겨보세요 ✏️
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {spaceComments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 sm:p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start gap-3 hover:border-amber-300 transition-colors"
                  >
                    {/* Commenter Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-300 overflow-hidden flex items-center justify-center shrink-0">
                      <CharacterAvatar
                        buddyId={c.avatar.buddyId}
                        outfit={c.avatar.outfit}
                        headwear={c.avatar.headwear}
                        toolItem={c.avatar.toolItem}
                        expression={c.avatar.expression}
                        themeColor={c.avatar.themeColor}
                        size={34}
                        showAura={false}
                        animate={false}
                      />
                    </div>

                    {/* Comment Body */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-jua text-xs text-slate-900 font-bold">
                            {c.authorName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            ({c.authorGradeClass})
                          </span>
                          {c.reactionTag && (
                            <span className="font-jua text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-md">
                              {c.reactionTag}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(c.createdAt).toLocaleDateString('ko-KR', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {c.content}
                      </p>

                      <div className="pt-1 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onLikeComment && onLikeComment(c.id)}
                          className="font-jua inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 transition-colors"
                        >
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                          <span>좋아요 {c.likes}</span>
                        </button>

                        {onDeleteComment && (
                          <button
                            type="button"
                            onClick={() => onDeleteComment(c.id)}
                            className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors"
                            title="댓글 삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Footer with Child-Friendly Stamp & Heart */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Child-Friendly Stamp Button */}
            <button
              onClick={() => onToggleStamp(space.id)}
              className={`font-jua flex items-center gap-2 px-4 py-2 text-xs sm:text-base rounded-2xl border-2 transition-all shadow-sm cursor-pointer ${
                isStamped
                  ? 'bg-emerald-600 text-white border-emerald-600 animate-in zoom-in-95'
                  : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-50'
              }`}
            >
              {character ? (
                <div className="w-7 h-7 rounded-xl bg-white border border-amber-300 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                  <CharacterAvatar
                    buddyId={character.buddyId}
                    outfit={character.outfit}
                    headwear={character.headwear}
                    toolItem={character.toolItem}
                    expression={character.expression}
                    themeColor={character.themeColor}
                    size={26}
                    showAura={false}
                    animate={false}
                  />
                </div>
              ) : (
                <Award className="w-5 h-5 text-amber-300" />
              )}
              <span>
                {isStamped
                  ? `${characterName || character?.name ? `${characterName || character?.name} 대원 ` : ''}방문 도장 획득! 💮`
                  : `${characterName || character?.name ? `${characterName || character?.name} 대원의 ` : ''}도장 쾅 🪪`}
              </span>
            </button>

            {/* Heart button */}
            <button
              onClick={() => onLike(space.id)}
              className="font-jua flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-base rounded-2xl bg-white border-2 border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>좋아요 {space.likes}</span>
            </button>
          </div>

          <button
            onClick={handleClose}
            className="font-jua px-5 py-2.5 text-xs sm:text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-2xl transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
