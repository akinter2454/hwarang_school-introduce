import React, { useState, useEffect, useRef } from 'react';
import { SpaceItem, FloorNumber, StudentCharacter } from '../types';
import { FLOOR_CONFIGS, FLOOR_TEMPLATES } from '../data/defaultSpaces';
import { PHOTO_PRESETS } from '../data/photoPresets';
import { compressImageFile } from '../utils/imageUtils';
import { 
  PlusCircle, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  Eye, 
  ShieldAlert, 
  BookOpen, 
  RefreshCw,
  Star,
  Camera,
  HeartHandshake
} from 'lucide-react';

interface BuildViewProps {
  spaces: SpaceItem[];
  editingSpaceId: string | null;
  initialFloor?: FloorNumber;
  onSaveSpace: (space: Omit<SpaceItem, 'id' | 'createdAt' | 'updatedAt' | 'likes'>, id?: string) => void;
  onCancelEdit: () => void;
  onSelectEditSpace: (id: string) => void;
  onSwitchToExperience: () => void;
  character?: StudentCharacter;
}

export const BuildView: React.FC<BuildViewProps> = ({
  spaces,
  editingSpaceId,
  initialFloor = 1,
  onSaveSpace,
  onCancelEdit,
  onSelectEditSpace,
  onSwitchToExperience,
  character,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

  // Form State
  const [floor, setFloor] = useState<FloorNumber>(initialFloor);
  const [name, setName] = useState('');
  const [oneLineIntro, setOneLineIntro] = useState('');
  const [description, setDescription] = useState('');
  const [specialPoint, setSpecialPoint] = useState('');
  const [usageGuide, setUsageGuide] = useState('');
  const [rules, setRules] = useState('');
  const [author, setAuthor] = useState('');
  const [studentGroup, setStudentGroup] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // UI state
  const [isCompressing, setIsCompressing] = useState(false);
  const [showPresetPicker, setShowPresetPicker] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If editingSpaceId is provided or changes, load the space data into form
  useEffect(() => {
    if (editingSpaceId) {
      const target = spaces.find((s) => s.id === editingSpaceId);
      if (target) {
        setFloor(target.floor);
        setName(target.name);
        setOneLineIntro(target.oneLineIntro);
        setDescription(target.description);
        setSpecialPoint(target.specialPoint);
        setUsageGuide(target.usageGuide);
        setRules(target.rules);
        setAuthor(target.author);
        setStudentGroup(target.studentGroup || '');
        setImages(target.images || []);
        setPrivacyAgreed(true);
        setActiveTab('form');
      }
    }
  }, [editingSpaceId, spaces]);

  // Load starter example template for current floor
  const handleLoadFloorTemplate = () => {
    const template = FLOOR_TEMPLATES[floor];
    if (!template) return;

    if (name && !confirm('현재 쓰고 있던 내용 대신 추천 예시 서식을 불러올까요?')) {
      return;
    }

    setName(template.name || '');
    setOneLineIntro(template.oneLineIntro || '');
    setDescription(template.description || '');
    setSpecialPoint(template.specialPoint || '');
    setUsageGuide(template.usageGuide || '');
    setRules(template.rules || '');

    // If no images yet, add floor preset photo
    const matchingPreset = PHOTO_PRESETS.find((p) => p.floor === floor);
    if (matchingPreset && images.length === 0) {
      setImages([matchingPreset.url]);
    }
  };

  // Reset Form
  const handleResetForm = () => {
    setName('');
    setOneLineIntro('');
    setDescription('');
    setSpecialPoint('');
    setUsageGuide('');
    setRules('');
    setAuthor('');
    setStudentGroup('');
    setImages([]);
    setPrivacyAgreed(false);
    setFormErrors([]);
    onCancelEdit();
  };

  // Multiple File Upload Handler with Auto Compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file);
        newImageUrls.push(compressed);
      }
      setImages((prev) => [...prev, ...newImageUrls]);
    } catch (err) {
      console.error(err);
      alert('사진을 불러오는 중에 문제가 생겼어요. 다시 시도해 주세요.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Remove Photo
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Set as primary cover photo
  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const remaining = prev.filter((_, idx) => idx !== index);
      return [selected, ...remaining];
    });
  };

  // Add preset photo
  const handleAddPreset = (url: string) => {
    setImages((prev) => [...prev, url]);
    setShowPresetPicker(false);
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!name.trim()) errors.push('장소 이름을 적어주세요! (예: 1층 학교 도서관)');
    if (!oneLineIntro.trim()) errors.push('한 줄 소개를 적어주세요! (이곳을 한마디로 자랑한다면?)');
    if (!description.trim()) errors.push('자세한 설명("이곳에서는 무엇을 하나요?")을 적어주세요.');
    if (!specialPoint.trim()) errors.push('특별한 점("친구들에게 자랑하고 싶은 특징")을 적어주세요.');
    if (!usageGuide.trim()) errors.push('이용 방법("언제, 어떻게 이용하나요?")을 적어주세요.');
    if (!rules.trim()) errors.push('지켜야 할 약속("이곳에서 지켜야 할 규칙")을 적어주세요.');
    if (!author.trim()) errors.push('소개한 친구 이름이나 학번을 적어주세요. (예: 3학년 1반 홍길동)');
    if (images.length === 0) errors.push('공간 사진을 최소 1장 이상 등록해주세요! (여러 장 올리면 더 멋져요 📸)');
    if (!privacyAgreed) errors.push('개인정보 보호 수칙(친구 얼굴과 이름표가 안 나오는 사진) 확인에 체크해주세요!');

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    onSaveSpace(
      {
        floor,
        name: name.trim(),
        oneLineIntro: oneLineIntro.trim(),
        description: description.trim(),
        specialPoint: specialPoint.trim(),
        usageGuide: usageGuide.trim(),
        rules: rules.trim(),
        author: author.trim(),
        studentGroup: studentGroup.trim(),
        images,
        status: 'pending', // Teacher approval required
      },
      editingSpaceId || undefined
    );

    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
      handleResetForm();
      setActiveTab('list');
    }, 1800);
  };

  const editingSpace = editingSpaceId ? spaces.find((s) => s.id === editingSpaceId) : null;

  return (
    <div className="space-y-6 pb-20">
      {/* Friendly Child-Centric Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="font-jua inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs">
              ✏️ 학생 제작 스튜디오
            </div>
            <h1 className="font-jua text-2xl sm:text-4xl tracking-tight">
              {editingSpace ? `"${editingSpace.name}" 고치기` : '우리 학교 멋진 장소 소개하기'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50">
              사진을 여러 장 올리고 질문에 답을 적으면, 선생님 확인 후 체험 페이지에 멋지게 나타나요!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('form')}
              className={`font-jua flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-base rounded-2xl transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-emerald-800 shadow-md ring-2 ring-white/50'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{editingSpace ? '수정하기' : '새 글 쓰기'}</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`font-jua flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-base rounded-2xl transition-all ${
                activeTab === 'list'
                  ? 'bg-white text-emerald-800 shadow-md ring-2 ring-white/50'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>작성한 글 목록 ({spaces.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-100 rounded-2xl border-2 border-emerald-400 flex items-center gap-3 text-emerald-900 text-sm shadow-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <strong className="font-extrabold text-base block">성공적으로 등록되었어요! 참 잘했어요! 🎉</strong>
            <span className="text-xs text-emerald-800 font-medium">
              선생님께서 확인(승인)해주시면 [학교 둘러보기] 화면에 전교생 친구들이 볼 수 있도록 공개됩니다.
            </span>
          </div>
        </div>
      )}

      {/* TAB 1: FORM VIEW (Editor + Live Preview) */}
      {activeTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Editor (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            {/* Error callout if invalid */}
            {formErrors.length > 0 && (
              <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span>아래 내용을 확인해 주세요!</span>
                </div>
                <ul className="list-disc list-inside text-xs text-rose-700 space-y-1 pl-1 font-medium">
                  {formErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 1. 층 선택 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-jua text-base text-slate-900 flex items-center gap-1.5">
                    <span>🏢 1. 몇 층에 있는 공간인가요?</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadFloorTemplate}
                    className="font-jua inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-950 hover:bg-amber-200 text-xs sm:text-sm transition-colors border border-amber-300 shadow-2xs"
                    title="선택한 층의 쉬운 예시 문구를 자동으로 채워줍니다"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{floor}층 추천 예시 서식 불러오기</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { f: 1, icon: '📚', label: '1층' },
                    { f: 2, icon: '💻', label: '2층' },
                    { f: 3, icon: '🔬', label: '3층' },
                    { f: 4, icon: '🏀', label: '4층' },
                  ].map(({ f, icon, label }) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFloor(f as FloorNumber)}
                      className={`font-jua py-3 px-2 rounded-2xl text-center border-2 transition-all ${
                        floor === f
                          ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md scale-102 ring-2 ring-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50/50 hover:border-amber-200'
                      }`}
                    >
                      <div className="text-2xl mb-0.5">{icon}</div>
                      <div className="text-sm sm:text-base">{label}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium pl-1">
                  💡 {FLOOR_CONFIGS.find((fc) => fc.floor === floor)?.name}
                </p>
              </div>

              {/* 2. 장소 이름 */}
              <div className="space-y-1.5">
                <label className="font-jua text-base text-slate-900 flex items-center gap-1.5">
                  <span>🏷️ 2. 장소 이름</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-1 font-sans">
                    (이곳의 이름은 무엇인가요?)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="예: 학교 도서관, 보건실, 컴퓨터실, 미술실"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                />
              </div>

              {/* 3. 한 줄 소개 */}
              <div className="space-y-1.5">
                <label className="font-jua text-base text-slate-900 flex items-center gap-1.5">
                  <span>💬 3. 한 줄 소개</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-1 font-sans">
                    (이곳을 한마디로 자랑한다면?)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="예: 재미있는 만화책을 읽고 푹신한 빈백에서 쉬어가는 우리들의 아지트!"
                  value={oneLineIntro}
                  onChange={(e) => setOneLineIntro(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                />
              </div>

              {/* 4. 사진 여러 장 올리기 (핵심 요구사항 완벽 지원) */}
              <div className="space-y-3 pt-3 pb-2 border-y border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>📸 4. 사진 올리기 (한 공간에 여러 장 올릴 수 있어요!)</span>
                    <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPresetPicker(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-100 text-sky-900 hover:bg-sky-200 text-xs font-bold transition-colors self-start sm:self-auto"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-sky-700" />
                    <span>학교 사진 보관함에서 고르기</span>
                  </button>
                </div>

                {/* Upload Action Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 rounded-2xl text-center cursor-pointer transition-colors group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-2xs group-hover:scale-105 transition-transform mb-2">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-extrabold text-emerald-950">
                    여기를 눌러 사진을 여러 장 선택해 보세요!
                  </p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    컴퓨터나 스마트폰에 있는 사진을 한 번에 2~5장 이상 골라서 올릴 수 있어요.
                  </p>
                  {isCompressing && (
                    <div className="mt-2 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin" /> 사진을 예쁘게 최적화하는 중...
                    </div>
                  )}
                </div>

                {/* Uploaded Photos Grid with Reordering / Star Cover / Delete */}
                {images.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span>올린 사진 ({images.length}장) - 첫 번째 사진이 카드 대표 사진이 돼요!</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-4/3 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-2xs"
                        >
                          <img
                            src={img}
                            alt={`등록 사진 ${index + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />

                          {/* Primary badge or set primary button */}
                          {index === 0 ? (
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-sm">
                              <Star className="w-3 h-3 fill-slate-950" />
                              <span>대표 사진</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(index)}
                              className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/60 hover:bg-amber-400 hover:text-slate-950 text-white text-[10px] font-bold backdrop-blur-xs transition-colors"
                              title="이 사진을 대표 사진으로 설정"
                            >
                              대표로 설정
                            </button>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-colors"
                            title="사진 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                            사진 {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400 font-medium">
                    아직 사진이 등록되지 않았어요. 사진을 1장 이상 꼭 등록해주세요!
                  </div>
                )}
              </div>

              {/* 5. 자세한 설명 */}
              <div className="space-y-1.5">
                <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>📖 5. 자세한 설명</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    (이곳에서는 무엇을 하나요?)
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="예: 최신 만화책과 동화책을 자유롭게 읽고 빌릴 수 있는 곳이에요. 조용히 책을 읽거나 친구들과 독서 모둠 활동도 해요!"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium leading-relaxed"
                />
              </div>

              {/* 6. 특별한 점 */}
              <div className="space-y-1.5">
                <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>🌟 6. 특별한 점</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    (친구들에게 자랑하고 싶은 매력이나 꿀팁은?)
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder="예: 창가 쪽에 푹신한 노란색 빈백 소파가 있어서 점심시간에 쉬기 좋아요! 사서선생님 독서 퀴즈에 참여하면 선물도 받아요."
                  value={specialPoint}
                  onChange={(e) => setSpecialPoint(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium leading-relaxed"
                />
              </div>

              {/* 7. 이용 방법 */}
              <div className="space-y-1.5">
                <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>⏰ 7. 이용 방법</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    (언제, 어떻게 이용할 수 있나요?)
                  </span>
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 월~금 점심시간(12:40~13:20)과 방과 후에 누구나 자유롭게 이용할 수 있어요. 대출 바코드 카드로 2권까지 빌릴 수 있어요."
                  value={usageGuide}
                  onChange={(e) => setUsageGuide(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium leading-relaxed"
                />
              </div>

              {/* 8. 지켜야 할 약속 */}
              <div className="space-y-1.5">
                <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <span>🤝 8. 지켜야 할 약속</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-1">
                    (이곳에서 지켜야 할 규칙은 무엇인가요?)
                  </span>
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 소곤소곤 조용히 이야기하기, 음료수나 과자 들고 오지 않기, 다 읽은 책은 반납 바구니 카트에 올려두기!"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium leading-relaxed"
                />
              </div>

              {/* 9. 작성한 학생 / 모둠 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span>👦 9. 소개한 친구 이름</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    {character && (
                      <button
                        type="button"
                        onClick={() => setAuthor(`${character.gradeClass} ${character.name}`)}
                        className="text-[11px] font-jua text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                        title="내 캐릭터 신분증 정보로 자동 입력"
                      >
                        내 캐릭터로 입력 🪪
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="예: 3학년 2반 김민서"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span>🧑‍🤝‍🧑 모둠 또는 동아리 이름 (선택)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 책사랑 도서부, 2모둠 탐험대"
                    value={studentGroup}
                    onChange={(e) => setStudentGroup(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* 10. 초등학생용 개인정보 지킴이 체크박스 */}
              <div className="p-4 sm:p-5 bg-amber-50 rounded-3xl border-2 border-amber-300 space-y-2">
                <div className="flex items-center gap-2 text-sm font-black text-amber-950">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>🚨 개인정보 지킴이 약속!</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  사진에 친구들의 얼굴이나 교복 명찰(이름표), 전화번호가 나오지 않도록 주의해주세요.
                  장소와 사물 위주로 찍은 사진이어야 안전해요!
                </p>
                <label className="flex items-start gap-2.5 text-xs text-amber-950 font-bold cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-amber-400 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>네! 친구 얼굴과 이름표가 안 나오는 안전한 사진임을 확인했어요. 👍</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  다시 쓰기 (초기화)
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onSwitchToExperience}
                    className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
                  >
                    학교 둘러보기로 가기
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black rounded-2xl shadow-md transition-all hover:scale-102"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{editingSpace ? '수정 완료하기 ✨' : '선생님께 제출하기 ✨'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live Card & Detail Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>체험 페이지에 나타날 모습 미리보기</span>
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                실시간 반영 중! 👀
              </span>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-md">
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="미리보기"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
                    <ImageIcon className="w-12 h-12 stroke-1 mb-2 text-slate-300" />
                    <span className="text-xs font-bold">사진을 올리면 여기에 뿅 나타나요!</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-xs font-black font-mono">
                  {floor}층
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/70 text-white text-xs font-bold font-mono">
                    📸 사진 {images.length}장
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 truncate">
                    {name || '장소 이름이 여기에 들어와요'}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {oneLineIntro || '한 줄 자랑거리가 여기에 표시됩니다.'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-700 border border-slate-100 font-medium">
                  <div>
                    <strong className="text-slate-900 block text-xs font-bold">📖 무엇을 하는 곳인가요?</strong>
                    <p className="line-clamp-2 mt-0.5">{description || '상세 설명 미리보기...'}</p>
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-xs font-bold">🌟 특별한 점 꿀팁</strong>
                    <p className="line-clamp-2 mt-0.5">{specialPoint || '특별한 매력 포인트...'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>소개: {author || '친구 이름'}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    선생님 확인 대기
                  </span>
                </div>
              </div>
            </div>

            {/* Helper tips for elementary students */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <strong className="font-extrabold flex items-center gap-1.5 text-amber-950">
                <span>💡 꿀팁: 사진을 여러 장 올려보세요!</span>
              </strong>
              <p className="leading-relaxed font-medium">
                넓은 교실 모습, 재미있는 물건, 안내판 등 여러 각도에서 찍은 사진을 올리면 친구들이 더 실감나게 감상할 수 있어요!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED SPACES LIST & EDIT SELECTION */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                학교 공간 소개글 목록 ({spaces.length}곳)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">내가 쓴 글을 찾아 내용을 고칠 수 있어요.</p>
            </div>
            <button
              onClick={() => {
                handleResetForm();
                setActiveTab('form');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>새 공간 쓰기</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {spaces.map((space) => {
              const statusTag = {
                approved: { text: '공개 완료 🎉', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                pending: { text: '선생님 검토 중 ⏳', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
                rejected: { text: '고쳐쓰기 필요 ✏️', bg: 'bg-rose-100 text-rose-800 border-rose-300' },
              }[space.status];

              return (
                <div
                  key={space.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                      {space.images[0] ? (
                        <img
                          src={space.images[0]}
                          alt={space.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      {space.images.length > 1 && (
                        <div className="absolute bottom-1 right-1 px-1 rounded bg-black/60 text-white text-[9px] font-mono">
                          +{space.images.length}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                          {space.floor}층
                        </span>
                        <h3 className="font-black text-slate-900 text-base">{space.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${statusTag.bg}`}>
                          {statusTag.text}
                        </span>
                        {space.isTemplateExample && (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            모범 예시
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 font-medium">{space.oneLineIntro}</p>
                      <div className="text-xs text-slate-400 font-medium">
                        작성자: {space.author} {space.studentGroup && `· 모둠: ${space.studentGroup}`} · 사진 {space.images.length}장
                      </div>

                      {space.reviewFeedback && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 mt-1 font-medium">
                          <strong>선생님 피드백:</strong> {space.reviewFeedback}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onSelectEditSpace(space.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>내용 고치기</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preset Photo Picker Modal */}
      {showPresetPicker && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">학교 시설 사진 보관함</h3>
                <p className="text-xs text-slate-500 mt-0.5">클릭하면 내 글의 사진 목록에 추가돼요!</p>
              </div>
              <button
                onClick={() => setShowPresetPicker(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
              >
                닫기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {PHOTO_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleAddPreset(preset.url)}
                  className="group rounded-2xl border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all text-left"
                >
                  <div className="aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 bg-white space-y-0.5">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {preset.floor}층
                    </span>
                    <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700 truncate">
                      {preset.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
