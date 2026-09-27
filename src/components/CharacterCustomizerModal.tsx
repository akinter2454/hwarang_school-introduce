import React, { useState } from 'react';
import { 
  StudentCharacter, 
  BuddyId, 
  OutfitId, 
  HeadwearId, 
  ToolItemId, 
  ExpressionId, 
  ThemeColorId 
} from '../types';
import { 
  BUDDY_LIST, 
  OUTFIT_LIST, 
  HEADWEAR_LIST, 
  TOOL_ITEM_LIST, 
  EXPRESSION_LIST, 
  THEME_COLOR_CONFIG, 
  getExplorerRank 
} from '../data/characterData';
import { CharacterAvatar } from './CharacterAvatar';
import { X, Check, Award, Dices, RotateCcw } from 'lucide-react';

interface CharacterCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: StudentCharacter;
  onSaveCharacter: (updated: StudentCharacter) => void;
  stampedFloorCount: number;
}

type TabCategory = 'buddy' | 'headwear' | 'outfit' | 'tool' | 'expression' | 'theme';

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  isOpen,
  onClose,
  character,
  onSaveCharacter,
  stampedFloorCount,
}) => {
  const [name, setName] = useState(character.name);
  const [gradeClass, setGradeClass] = useState(character.gradeClass);
  const [buddyId, setBuddyId] = useState<BuddyId>(character.buddyId || 'cat');
  const [outfit, setOutfit] = useState<OutfitId>(character.outfit || 'vest');
  const [headwear, setHeadwear] = useState<HeadwearId>(character.headwear || 'safari');
  const [toolItem, setToolItem] = useState<ToolItemId>(character.toolItem || 'magnifier');
  const [expression, setExpression] = useState<ExpressionId>(character.expression || 'smile');
  const [themeColor, setThemeColor] = useState<ThemeColorId>(character.themeColor || 'amber');
  const [activeTab, setActiveTab] = useState<TabCategory>('buddy');

  if (!isOpen) return null;

  const currentBuddy = BUDDY_LIST.find((b) => b.id === buddyId) || BUDDY_LIST[0];
  const currentHeadwear = HEADWEAR_LIST.find((h) => h.id === headwear) || HEADWEAR_LIST[0];
  const currentOutfit = OUTFIT_LIST.find((o) => o.id === outfit) || OUTFIT_LIST[0];
  const currentTool = TOOL_ITEM_LIST.find((t) => t.id === toolItem) || TOOL_ITEM_LIST[0];
  const currentExpression = EXPRESSION_LIST.find((e) => e.id === expression) || EXPRESSION_LIST[0];
  const currentTheme = THEME_COLOR_CONFIG[themeColor] || THEME_COLOR_CONFIG.amber;
  const rankInfo = getExplorerRank(stampedFloorCount);

  // Randomizer fun button for elementary kids
  const handleRandomize = () => {
    const randomBuddy = BUDDY_LIST[Math.floor(Math.random() * BUDDY_LIST.length)].id;
    const randomOutfit = OUTFIT_LIST[Math.floor(Math.random() * OUTFIT_LIST.length)].id;
    const randomHeadwear = HEADWEAR_LIST[Math.floor(Math.random() * HEADWEAR_LIST.length)].id;
    const randomTool = TOOL_ITEM_LIST[Math.floor(Math.random() * TOOL_ITEM_LIST.length)].id;
    const randomExpression = EXPRESSION_LIST[Math.floor(Math.random() * EXPRESSION_LIST.length)].id;
    const colorKeys = Object.keys(THEME_COLOR_CONFIG) as ThemeColorId[];
    const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];

    setBuddyId(randomBuddy);
    setOutfit(randomOutfit);
    setHeadwear(randomHeadwear);
    setToolItem(randomTool);
    setExpression(randomExpression);
    setThemeColor(randomColor);
  };

  const handleReset = () => {
    setBuddyId('cat');
    setOutfit('vest');
    setHeadwear('safari');
    setToolItem('magnifier');
    setExpression('smile');
    setThemeColor('amber');
  };

  const handleSave = () => {
    onSaveCharacter({
      ...character,
      name: name.trim() || '씩씩한 탐험이',
      gradeClass: gradeClass.trim() || '3학년 1반',
      buddyId,
      outfit,
      headwear,
      toolItem,
      expression,
      themeColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b-2 border-amber-200 bg-amber-100/80">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">✨</span>
            <div>
              <h2 className="font-jua text-xl sm:text-2xl text-slate-950 flex items-center gap-2">
                <span>나만의 탐험대 캐릭터 꾸미기</span>
                <span className="text-xs bg-amber-300/80 text-amber-950 font-sans font-bold px-2 py-0.5 rounded-full">
                  아이템 풀세트 착용!
                </span>
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                귀여운 단짝을 고르고 모자, 의상, 도구를 착용하여 학교 탐험 신분증을 완성해 보세요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-amber-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Interactive Character Stage & ID Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-jua text-xs text-slate-600 flex items-center gap-1">
                <span>🪪</span> 나의 탐험대원 신분증 미리보기
              </span>

              {/* Fun quick randomize & reset */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRandomize}
                  title="랜덤으로 아이템 뽑기"
                  className="font-jua text-xs inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  <Dices className="w-3.5 h-3.5 text-amber-700" />
                  <span>랜덤 뽑기</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  title="기본 코디로 리셋"
                  className="font-jua text-xs p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ID Card Outer Container */}
            <div className={`p-5 rounded-3xl border-3 ${currentTheme.border} ${currentTheme.bg} shadow-lg relative overflow-hidden space-y-4`}>
              
              {/* ID Card Top Ribbon */}
              <div className="flex items-center justify-between">
                <span className="font-jua text-xs px-2.5 py-1 rounded-xl bg-white/90 text-slate-900 shadow-2xs">
                  초등학교 탐험대원
                </span>
                <span className="font-jua text-xs font-bold text-amber-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {rankInfo.badge}
                </span>
              </div>

              {/* Centered Character Stage with Layered SVG Avatar */}
              <div className="relative mx-auto w-44 h-48 rounded-3xl bg-white/90 border-3 border-white shadow-md flex items-center justify-center p-2 overflow-hidden">
                <CharacterAvatar
                  buddyId={buddyId}
                  outfit={outfit}
                  headwear={headwear}
                  toolItem={toolItem}
                  expression={expression}
                  themeColor={themeColor}
                  size={160}
                  hasHonorMedal={stampedFloorCount >= 4}
                  animate={true}
                />

                {/* Floating item name tooltips */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-2xs text-[10px] font-jua text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {currentBuddy.emoji} {currentBuddy.name}
                </div>
              </div>

              {/* Student Identity Information */}
              <div className="text-center space-y-1.5 bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-white">
                <div className="font-jua text-xl text-slate-950">
                  {name.trim() || '씩씩한 탐험이'}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {gradeClass.trim() || '3학년 1반'} · 단짝: <strong>{currentBuddy.name}</strong> ({currentBuddy.personality})
                </div>

                {/* Explorer Title connected to Stamps */}
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <div className="font-jua text-xs text-emerald-800 flex items-center justify-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{rankInfo.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    도장 미션: <strong>{stampedFloorCount} / 4개 층</strong> 정복 중!
                  </div>
                </div>
              </div>

              {/* Equipped Summary Chips */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-jua">
                <div className="bg-white/80 p-1 rounded-xl text-slate-700 border border-white/60">
                  <span className="block text-[9px] text-slate-500 font-sans">모자</span>
                  {currentHeadwear.emoji} {currentHeadwear.name}
                </div>
                <div className="bg-white/80 p-1 rounded-xl text-slate-700 border border-white/60">
                  <span className="block text-[9px] text-slate-500 font-sans">의상</span>
                  {currentOutfit.emoji} {currentOutfit.name}
                </div>
                <div className="bg-white/80 p-1 rounded-xl text-slate-700 border border-white/60">
                  <span className="block text-[9px] text-slate-500 font-sans">도구</span>
                  {currentTool.emoji} {currentTool.name}
                </div>
              </div>
            </div>

            {/* Stamp Mission Hint */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
              💡 <strong>스탬프 연동 보상</strong>: 4개 층의 공간을 모두 방문하여 도장을 찍으면 캐릭터 목에 <strong>🏆 [학교 명예 탐험 박사 골드 훈장]</strong>이 자동으로 수여됩니다!
            </div>
          </div>

          {/* Right: Customization Controls & Dressing Room (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* 1. Name & Grade Input Fields */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="font-jua text-xs sm:text-sm text-slate-900 flex items-center gap-1">
                  <span>👦 내 이름 / 닉네임</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 민서, 도윤이"
                  className="w-full px-3 py-1.5 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="font-jua text-xs sm:text-sm text-slate-900 flex items-center gap-1">
                  <span>🏫 학년 / 반</span>
                </label>
                <input
                  type="text"
                  value={gradeClass}
                  onChange={(e) => setGradeClass(e.target.value)}
                  placeholder="예: 3학년 2반"
                  className="w-full px-3 py-1.5 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>
            </div>

            {/* Category Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b-2 border-slate-100 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'buddy', label: '단짝 친구', icon: '🐾', count: BUDDY_LIST.length },
                { id: 'headwear', label: '모자·머리', icon: '🤠', count: HEADWEAR_LIST.length },
                { id: 'outfit', label: '의상·옷', icon: '🦺', count: OUTFIT_LIST.length },
                { id: 'tool', label: '탐험 도구', icon: '🎒', count: TOOL_ITEM_LIST.length },
                { id: 'expression', label: '표정', icon: '😊', count: EXPRESSION_LIST.length },
                { id: 'theme', label: '테마 색상', icon: '🌈', count: 5 },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TabCategory)}
                    className={`font-jua text-xs sm:text-sm px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-xs scale-102'
                        : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT PANELS */}
            
            {/* A. BUDDY SELECTION (7 cute choices with vector preview) */}
            {activeTab === 'buddy' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-jua text-sm text-slate-900 flex items-center gap-1.5">
                    <span>🐾 탐험을 함께할 단짝 캐릭터를 골라주세요</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">총 7가지 친구</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {BUDDY_LIST.map((b) => {
                    const isSelected = buddyId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBuddyId(b.id)}
                        className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-200 scale-102'
                            : 'border-slate-200 bg-slate-50 hover:bg-amber-50/40 hover:border-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-jua px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                            {b.category}
                          </span>
                          <span className="text-lg">{b.emoji}</span>
                        </div>

                        {/* Interactive Vector Preview */}
                        <div className="my-1.5 mx-auto bg-white rounded-xl p-1 shadow-2xs border border-slate-100 flex items-center justify-center">
                          <CharacterAvatar
                            buddyId={b.id}
                            outfit={outfit}
                            headwear={headwear}
                            toolItem={toolItem}
                            expression={expression}
                            themeColor={themeColor}
                            size={56}
                            animate={false}
                          />
                        </div>

                        <div>
                          <div className="font-jua text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                            <span>{b.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {b.personality}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 font-medium">
                  🌟 <strong>{currentBuddy.name}</strong>: &ldquo;{currentBuddy.tagline}&rdquo;
                </div>
              </div>
            )}

            {/* B. HEADWEAR (8 choices properly fitted on head) */}
            {activeTab === 'headwear' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-jua text-sm text-slate-900 flex items-center gap-1.5">
                    <span>🤠 머리 위에 씌울 모자 & 장식</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">머리에 딱 맞게 착용됩니다!</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {HEADWEAR_LIST.map((h) => {
                    const isSelected = headwear === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHeadwear(h.id)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-100 shadow-sm ring-2 ring-amber-200 scale-102'
                            : 'border-slate-200 bg-slate-50 hover:bg-amber-50/50'
                        }`}
                      >
                        <div className="text-3xl mb-1">{h.emoji}</div>
                        <div className="font-jua text-xs text-slate-900">{h.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{h.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. OUTFIT / CLOTHES (5 choices worn on body) */}
            {activeTab === 'outfit' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-jua text-sm text-slate-900 flex items-center gap-1.5">
                    <span>🦺 몸에 입힐 탐험대 의상</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">캐릭터 몸통에 쏙 입혀집니다!</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {OUTFIT_LIST.map((o) => {
                    const isSelected = outfit === o.id;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setOutfit(o.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-100 shadow-sm ring-2 ring-amber-200 scale-102'
                            : 'border-slate-200 bg-slate-50 hover:bg-amber-50/50'
                        }`}
                      >
                        <div className="text-3xl p-2 bg-white rounded-xl shadow-2xs border border-slate-200">
                          {o.emoji}
                        </div>
                        <div>
                          <div className="font-jua text-sm text-slate-900">{o.name}</div>
                          <p className="text-xs text-slate-500 mt-0.5">{o.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* D. TOOL ITEMS (7 choices held in hand) */}
            {activeTab === 'tool' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-jua text-sm text-slate-900 flex items-center gap-1.5">
                    <span>🎒 손에 쥘 탐험 필수 아이템</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">손에 쥐고 탐험을 떠나요!</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TOOL_ITEM_LIST.map((t) => {
                    const isSelected = toolItem === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setToolItem(t.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-200 scale-102'
                            : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/40'
                        }`}
                      >
                        <div className="text-3xl p-2 bg-white rounded-xl shadow-2xs border border-slate-200">
                          {t.emoji}
                        </div>
                        <div>
                          <div className="font-jua text-sm text-slate-900">{t.name}</div>
                          <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* E. EXPRESSIONS (4 choices) */}
            {activeTab === 'expression' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-jua text-sm text-slate-900 flex items-center gap-1.5">
                    <span>😊 탐험가의 얼굴 표정 & 볼터치</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">눈빛과 미소가 바뀝니다!</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {EXPRESSION_LIST.map((e) => {
                    const isSelected = expression === e.id;
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => setExpression(e.id)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50 shadow-sm ring-2 ring-rose-200 scale-102'
                            : 'border-slate-200 bg-slate-50 hover:bg-rose-50/40'
                        }`}
                      >
                        <div className="text-3xl mb-1">{e.emoji}</div>
                        <div className="font-jua text-xs text-slate-900">{e.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{e.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* F. THEME COLOR */}
            {activeTab === 'theme' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-jua text-sm text-slate-900 flex items-center gap-1.5">
                    <span>🌈 학생증 및 배경 테마 색상</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">신분증 테두리와 아우라가 바뀝니다!</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(THEME_COLOR_CONFIG) as ThemeColorId[]).map((colorKey) => {
                    const cfg = THEME_COLOR_CONFIG[colorKey];
                    const isSelected = themeColor === colorKey;
                    return (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => setThemeColor(colorKey)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? `${cfg.bg} ${cfg.border} shadow-sm ring-2 ${cfg.ring} scale-102`
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full ${cfg.bg} border-2 ${cfg.border} shadow-2xs`} />
                        <div>
                          <div className="font-jua text-sm text-slate-900">{cfg.name} 테마</div>
                          <p className="text-xs text-slate-500 mt-0.5">상큼하고 예쁜 파스텔 배경</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="px-6 py-4 border-t-2 border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="font-jua px-4 py-2.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            취소하기
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="font-jua inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base text-slate-950 bg-amber-400 hover:bg-amber-500 border-2 border-amber-500 rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <Check className="w-5 h-5" />
            <span>내 캐릭터 & 아이템 착용 완료! ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
};
