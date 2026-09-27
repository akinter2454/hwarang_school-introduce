import React from 'react';
import { ViewMode, StudentCharacter } from '../types';
import { Compass, Edit3, ShieldCheck, HelpCircle, Palette } from 'lucide-react';
import { BUDDY_LIST, HEADWEAR_LIST } from '../data/characterData';
import { CharacterAvatar } from './CharacterAvatar';

interface NavbarProps {
  currentMode: ViewMode;
  onSelectMode: (mode: ViewMode) => void;
  onOpenGuide: () => void;
  onOpenCharacterCustomizer: () => void;
  character: StudentCharacter;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenGuide,
  onOpenCharacterCustomizer,
  character,
  pendingCount,
}) => {
  const currentBuddy = BUDDY_LIST.find((b) => b.id === character.buddyId) || BUDDY_LIST[0];
  const currentHeadwear = HEADWEAR_LIST.find((h) => h.id === character.headwear) || HEADWEAR_LIST[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[76px] py-2 flex items-center justify-between gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
        {/* Zone 1: Single text element wordmark with cute mascot */}
        <button
          onClick={() => onSelectMode('experience')}
          className="flex items-center gap-3 text-left group shrink-0"
        >
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-amber-400 bg-amber-100 shadow-xs group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
            <CharacterAvatar
              buddyId={character.buddyId}
              outfit={character.outfit}
              headwear={character.headwear}
              toolItem={character.toolItem}
              expression={character.expression}
              themeColor={character.themeColor}
              size={40}
              showAura={false}
              animate={false}
            />
          </div>
          <div className="shrink-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-jua text-xl sm:text-2xl md:text-[26px] text-slate-950 font-bold group-hover:text-emerald-700 transition-colors leading-none">
                우리 학교 공간 탐험대
              </span>
              <span className="text-xl sm:text-2xl">🎒</span>
            </div>
            <div className="mt-1 flex items-center whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 font-jua text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300/80 shadow-2xs whitespace-nowrap">
                <span>📸</span>
                <span>우리가 직접 찍고 꾸미는 우리 학교!</span>
              </span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Mode Selector - elementary friendly) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => onSelectMode('experience')}
            className={`font-jua flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-base rounded-2xl transition-all whitespace-nowrap shrink-0 ${
              currentMode === 'experience'
                ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 scale-102 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-amber-50'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="hidden sm:inline">학교 </span>
            <span>둘러보기</span>
          </button>

          <button
            onClick={() => onSelectMode('build')}
            className={`font-jua flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-base rounded-2xl transition-all whitespace-nowrap shrink-0 ${
              currentMode === 'build'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 scale-102 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'
            }`}
          >
            <Edit3 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span className="hidden sm:inline">내가 직접 </span>
            <span>소개하기</span>
          </button>

          <button
            onClick={() => onSelectMode('admin')}
            className={`font-jua relative flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-base rounded-2xl transition-all whitespace-nowrap shrink-0 ${
              currentMode === 'admin'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 scale-102 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-indigo-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-300 shrink-0" />
            <span>선생님<span className="hidden md:inline"> 확인방</span></span>
            {pendingCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full animate-bounce">
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Student Character Badge & Guide */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Customizer quick launch button */}
          <button
            onClick={onOpenCharacterCustomizer}
            className="font-jua flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-2xl text-xs sm:text-sm text-amber-950 transition-all shadow-2xs hover:scale-102 cursor-pointer shrink-0"
            title="나의 캐릭터와 신분증 꾸미기"
          >
            <div className="w-7 h-7 rounded-xl bg-white border border-amber-200 overflow-hidden flex items-center justify-center shrink-0">
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
            <span className="truncate max-w-[70px] sm:max-w-[100px] font-bold">
              {character.name}
            </span>
            <Palette className="w-3.5 h-3.5 text-amber-700 hidden sm:inline" />
          </button>

          <button
            onClick={onOpenGuide}
            className="font-jua flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-2xl transition-colors whitespace-nowrap shadow-2xs shrink-0"
            title="사용 방법 알아보기"
          >
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="hidden lg:inline">탐험 안내서</span>
          </button>
        </div>
      </div>
    </header>
  );
};
