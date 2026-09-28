import React, { useRef, useState } from 'react';
import { StudentCharacter, SpaceItem } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { 
  Trophy, 
  Download, 
  Printer, 
  X, 
  Sparkles, 
  CheckCircle, 
  Award, 
  Share2, 
  Check, 
  School,
  Calendar,
  ShieldCheck
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: StudentCharacter;
  visitedStampIds: string[];
  spaces: SpaceItem[];
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  character,
  visitedStampIds,
  spaces,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Calculate stamped floors
  const approvedSpaces = spaces.filter((s) => s.status === 'approved');
  const floorStampedMap: Record<number, boolean> = {
    1: approvedSpaces.filter((s) => s.floor === 1).some((s) => visitedStampIds.includes(s.id)),
    2: approvedSpaces.filter((s) => s.floor === 2).some((s) => visitedStampIds.includes(s.id)),
    3: approvedSpaces.filter((s) => s.floor === 3).some((s) => visitedStampIds.includes(s.id)),
    4: approvedSpaces.filter((s) => s.floor === 4).some((s) => visitedStampIds.includes(s.id)),
    5: approvedSpaces.filter((s) => s.floor === 5).some((s) => visitedStampIds.includes(s.id)),
  };
  const stampedCount = Object.values(floorStampedMap).filter(Boolean).length;
  const isComplete = stampedCount >= 5;

  const today = new Date();
  const dateFormatted = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const serialNo = `EXP-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Download Certificate as PNG using HTML5 Canvas drawing
  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set high resolution for certificate print/save
      const width = 1200;
      const height = 850;
      canvas.width = width;
      canvas.height = height;

      // 1. Background Cream / Gold
      ctx.fillStyle = '#fffdf7';
      ctx.fillRect(0, 0, width, height);

      // 2. Outer Ornate Border
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#d97706'; // amber-600
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f59e0b'; // amber-500
      ctx.strokeRect(44, 44, width - 88, height - 88);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#fbbf24'; // amber-400
      ctx.strokeRect(52, 52, width - 104, height - 104);

      // Corner Accents
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.stroke();
      };
      drawCorner(44, 44);
      drawCorner(width - 44, 44);
      drawCorner(44, height - 44);
      drawCorner(width - 44, height - 44);

      // 3. Top Header / Kicker
      ctx.textAlign = 'center';
      ctx.fillStyle = '#92400e'; // amber-800
      ctx.font = 'bold 22px "Jua", "Apple SD Gothic Neo", sans-serif';
      ctx.fillText('⭐ 우리 학교 공간 탐험대 · 공식 탐험 수료증 ⭐', width / 2, 105);

      // 4. Main Title
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.font = 'bold 44px "Jua", "Apple SD Gothic Neo", sans-serif';
      ctx.fillText('학교 명예 탐험 박사 인증서', width / 2, 165);

      ctx.fillStyle = '#d97706';
      ctx.font = '18px "Apple SD Gothic Neo", sans-serif';
      ctx.fillText('CERTIFICATE OF EXPLORATION MASTER', width / 2, 195);

      // Ribbon line
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 215);
      ctx.lineTo(width - 250, 215);
      ctx.stroke();

      // 5. Student Info Block
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 28px "Jua", "Apple SD Gothic Neo", sans-serif';
      ctx.fillText(`[${character.gradeClass}]  ${character.name} 대원`, width / 2, 265);

      // 6. Citation Text
      ctx.fillStyle = '#334155';
      ctx.font = '20px "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
      const citation1 = '위 학생은 우리 학교 1층부터 5층까지의 모든 특별 공간을 성실하게 탐험하고,';
      const citation2 = '친구들과 함께 사진과 꿀팁을 직접 기록하는 아카이빙 미션을 훌륭하게 완수하여';
      const citation3 = '우리 학교를 빛낸 [학교 명예 탐험 박사]로 인정하므로 이 인증서를 수여합니다.';
      ctx.fillText(citation1, width / 2, 325);
      ctx.fillText(citation2, width / 2, 360);
      ctx.fillText(citation3, width / 2, 395);

      // 7. Stamped Floors Badges (4 boxes)
      const floorLabels = [
        { num: '1층', name: '도서관·보건실', icon: '📚' },
        { num: '2층', name: '컴퓨터·메이커', icon: '💻' },
        { num: '3층', name: '과학실·미술실', icon: '🔬' },
        { num: '4층', name: '체육관·방송실', icon: '🏀' },
        { num: '5층', name: '5층 공간 탐험', icon: '🌟' },
      ];

      const startX = 165;
      const cardW = 165;
      const gap = 12;
      const cardY = 445;

      floorLabels.forEach((fl, idx) => {
        const cx = startX + idx * (cardW + gap);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx, cardY, cardW, 90, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#047857'; // emerald-700
        ctx.font = 'bold 18px "Jua", sans-serif';
        ctx.fillText(`${fl.icon} ${fl.num}`, cx + cardW / 2, cardY + 32);

        ctx.fillStyle = '#475569';
        ctx.font = '14px "Apple SD Gothic Neo", sans-serif';
        ctx.fillText(fl.name, cx + cardW / 2, cardY + 56);

        ctx.fillStyle = '#059669';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('💮 탐험 완료', cx + cardW / 2, cardY + 76);
      });

      // 8. Date and Issuing Authority
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 18px "Apple SD Gothic Neo", sans-serif';
      ctx.fillText(dateFormatted, width / 2, 595);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 28px "Jua", "Apple SD Gothic Neo", sans-serif';
      ctx.fillText('우리 학교 공간 탐험대 본부', width / 2 - 35, 650);

      // Red Official Seal Stamp (직인)
      const sealX = width / 2 + 160;
      const sealY = 640;
      ctx.strokeStyle = '#dc2626'; // red-600
      ctx.lineWidth = 4;
      ctx.strokeRect(sealX - 32, sealY - 32, 64, 64);

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 14px "Jua", sans-serif';
      ctx.fillText('탐험', sealX, sealY - 8);
      ctx.fillText('인증', sealX, sealY + 14);

      // 9. Footer serial and student motto
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px monospace';
      ctx.fillText(`증서 발급 번호 : ${serialNo}`, 60, height - 60);

      ctx.textAlign = 'right';
      ctx.fillText('우리가 직접 찍고 꾸미는 우리 학교', width - 60, height - 60);

      // 10. Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `학교탐험대_수료인증서_${character.name}_대원.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export certificate image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `🎉 [${character.gradeClass} ${character.name}] 대원이 우리 학교 1~5층 공간 탐험 스탬프를 모두 모아 '학교 명예 탐험 박사' 인증서를 받았습니다! 🏫✨`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border-4 border-amber-400 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[94vh] print:max-h-none print:shadow-none print:border-none">
        {/* Top Dialog Bar (Hidden during print) */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-slate-950 font-jua text-lg sm:text-xl">
            <Trophy className="w-6 h-6 text-amber-950 animate-bounce" />
            <span>학교 탐험 완수 축하 인증서 🎓</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-amber-500/40 text-amber-950 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Display Paper Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-amber-50/40 flex items-center justify-center">
          <div
            ref={certificateRef}
            className="relative w-full max-w-2xl bg-[#fffdf7] rounded-2xl border-8 border-double border-amber-600 p-6 sm:p-10 shadow-xl text-center space-y-6 print:border-8 print:shadow-none"
          >
            {/* Corner Gold Ribbon Badges */}
            <div className="absolute top-3 left-3 text-amber-500 opacity-60 text-xl select-none">✦</div>
            <div className="absolute top-3 right-3 text-amber-500 opacity-60 text-xl select-none">✦</div>
            <div className="absolute bottom-3 left-3 text-amber-500 opacity-60 text-xl select-none">✦</div>
            <div className="absolute bottom-3 right-3 text-amber-500 opacity-60 text-xl select-none">✦</div>

            {/* Certificate Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-jua text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>우리 학교 공간 탐험대 · 공식 인증</span>
              </div>
              <h1 className="font-jua text-2xl sm:text-4xl text-slate-950 tracking-tight">
                학교 명예 탐험 박사 인증서
              </h1>
              <p className="text-[11px] sm:text-xs font-mono text-amber-800 tracking-wider">
                CERTIFICATE OF EXPLORATION MASTER
              </p>
            </div>

            {/* Student Avatar & Identity Badge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2 border-y-2 border-dashed border-amber-200 bg-white/70 rounded-2xl p-4">
              <div className="relative w-24 h-24 rounded-2xl bg-white border-2 border-amber-300 shadow-md flex items-center justify-center shrink-0">
                <CharacterAvatar
                  buddyId={character.buddyId}
                  outfit={character.outfit}
                  headwear={character.headwear}
                  toolItem={character.toolItem}
                  expression={character.expression}
                  themeColor={character.themeColor}
                  size={84}
                  hasHonorMedal={true}
                  animate={false}
                />
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 text-slate-950 rounded-full border border-white flex items-center justify-center shadow-xs font-bold text-xs">
                  🏆
                </div>
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="font-jua text-xl sm:text-2xl text-slate-950">
                  <span className="text-emerald-800">[{character.gradeClass}]</span> {character.name} 대원
                </div>
                <div className="text-xs font-jua text-amber-900 bg-amber-100/90 inline-block px-2.5 py-0.5 rounded-lg border border-amber-300">
                  탐험 칭호: 전설의 학교 보물 마스터
                </div>
              </div>
            </div>

            {/* Citation Statement */}
            <p className="font-jua text-sm sm:text-base text-slate-800 leading-relaxed max-w-xl mx-auto">
              위 학생은 우리 학교 1층부터 5층까지의 모든 특별 공간을 성실히 탐험하고,
              친구들과 함께 직접 찍은 사진과 꿀팁을 기록하는 아카이빙 미션을 훌륭하게 완수하여
              우리 학교를 빛낸 <strong className="text-emerald-800 underline decoration-amber-400 decoration-wavy">[학교 명예 탐험 박사]</strong>로 인정하므로 이 인증서를 수여합니다.
            </p>

            {/* 5 Floors Stamped Achievement Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {[
                { floor: 1, name: '1층 도서관·보건실', icon: '📚' },
                { floor: 2, name: '2층 컴퓨터·메이커', icon: '💻' },
                { floor: 3, name: '3층 과학실·미술실', icon: '🔬' },
                { floor: 4, name: '4층 체육관·방송실', icon: '🏀' },
                { floor: 5, name: '5층 공간 탐험', icon: '🌟' },
              ].map((fl) => (
                <div
                  key={fl.floor}
                  className="bg-white border-2 border-emerald-300 rounded-xl p-2 text-center shadow-2xs space-y-0.5"
                >
                  <div className="text-base">{fl.icon}</div>
                  <div className="font-jua text-xs text-slate-900">{fl.name}</div>
                  <div className="text-[11px] font-jua text-emerald-700 flex items-center justify-center gap-0.5">
                    <Check className="w-3 h-3 stroke-3" /> <span>완료 💮</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Date & Official Seal */}
            <div className="pt-4 flex items-end justify-between border-t border-amber-200 text-left">
              <div className="space-y-1 text-xs text-slate-500 font-mono">
                <div>발급일: {dateFormatted}</div>
                <div>인증번호: {serialNo}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-jua text-base sm:text-lg text-slate-950">
                    우리 학교 공간 탐험대 본부
                  </div>
                  <div className="text-[10px] text-amber-800 font-jua">
                    우리가 직접 찍고 꾸미는 우리 학교
                  </div>
                </div>

                {/* Red Circular/Square Official Stamp Seal */}
                <div className="w-14 h-14 rounded-xl border-3 border-rose-600 bg-rose-50/50 flex flex-col items-center justify-center text-rose-600 font-jua text-xs leading-none shadow-xs rotate-[-6deg] select-none">
                  <span>탐험</span>
                  <span className="font-extrabold mt-0.5">인증</span>
                  <span className="text-[9px]">💮</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Controls (Hidden during print) */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            {/* Download as Image */}
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="font-jua inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-sm shadow-md transition-all hover:scale-103 cursor-pointer border-2 border-amber-500 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? '인증서 이미지 생성 중...' : '인증서 사진으로 저장 📸'}</span>
            </button>

            {/* Print Certificate */}
            <button
              onClick={handlePrint}
              className="font-jua inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm shadow-md transition-all hover:scale-103 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>종이로 인쇄 / PDF 🖨️</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="font-jua inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? '복사 완료! ✨' : '자랑 문구 복사'}</span>
            </button>

            <button
              onClick={onClose}
              className="font-jua px-4 py-2.5 rounded-2xl text-slate-600 hover:text-slate-900 text-xs sm:text-sm"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
