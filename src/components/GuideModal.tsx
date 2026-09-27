import React from 'react';
import { X, Camera, FileText, CheckCircle2, Send, Users, ShieldAlert, Sparkles, Award } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToBuild: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onGoToBuild }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border-2 border-amber-300 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-amber-100 bg-amber-50">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🎒</span>
            <div>
              <h2 className="font-jua text-xl text-slate-900">학교 공간 탐험대 활동 안내서</h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                우리가 직접 찍고 소개하는 우리 학교 보물 지도 만들기!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-amber-100/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Step flow */}
          <div>
            <h3 className="font-jua text-sm text-amber-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>탐험 활동 순서 (6단계)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200">
                <span className="font-jua w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-xs shrink-0">1</span>
                <div>
                  <p className="font-jua text-slate-900 text-base">소개할 장소 정하기</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">모둠 친구들과 함께 친구들에게 알리고 싶은 특별한 공간(1~4층)을 골라요.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-sky-50 rounded-2xl border border-sky-200">
                <span className="font-jua w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center text-xs shrink-0">2</span>
                <div>
                  <p className="font-jua text-slate-900 text-base">사진 여러 장 찍기 📸</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">교실 모습, 재미있는 물건, 간판 등을 여러 각도에서 찰칵 촬영해요.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="font-jua w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">3</span>
                <div>
                  <p className="font-jua text-slate-900 text-base">소개 질문 6가지 작성</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">이름, 한 줄 자랑, 하는 일, 숨겨진 꿀팁, 이용 시간, 지킬 약속을 적어요.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="font-jua w-7 h-7 rounded-xl bg-purple-500 text-white flex items-center justify-center text-xs shrink-0">4</span>
                <div>
                  <p className="font-jua text-slate-900 text-base">빌드 화면에서 글 올리기</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">예시 서식을 참고하여 사진 여러 장과 글을 등록하고 제출해요.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200">
                <span className="font-jua w-7 h-7 rounded-xl bg-indigo-500 text-white flex items-center justify-center text-xs shrink-0">5</span>
                <div>
                  <p className="font-jua text-slate-900 text-base">선생님 확인 및 승인 👩‍🏫</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">선생님께서 개인정보와 내용을 확인 후 승인해주시면 바로 공개돼요.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-rose-50 rounded-2xl border border-rose-200">
                <span className="font-jua w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center text-xs shrink-0">6</span>
                <div>
                  <p className="font-jua text-slate-900 text-base">친구들과 도장 투어! 💮</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">다른 반 친구들이 쓴 공간을 둘러보고 방문 도장과 하트를 남겨요.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Alert for Kids */}
          <div className="p-4 sm:p-5 bg-rose-50 rounded-3xl border-2 border-rose-200 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-950 leading-relaxed font-medium">
              <strong className="font-extrabold text-sm text-rose-900 block mb-1">
                🚨 꼭 지켜야 할 개인정보 안전 약속!
              </strong>
              사진을 찍을 때 친구 얼굴, 교복 명찰(이름표), 전화번호가 나오지 않도록 주의해요.
              사람 대신 멋진 공간과 물건 위주로 사진을 찍어야 모두가 안전해요!
            </div>
          </div>

          {/* Multiple Photo Tip */}
          <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 text-xs text-emerald-950 space-y-1 font-medium">
            <strong className="font-extrabold text-emerald-900 flex items-center gap-1.5">
              <span>📸 사진은 한 공간에 여러 장 올릴 수 있어요!</span>
            </strong>
            <p>
              입구 모습, 교실 전체, 내가 좋아하는 특별한 구석 등 여러 장을 올리면 친구들이 슬라이드로 넘겨보며 더 생생하게 구경할 수 있어요.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="font-jua px-4 py-2.5 text-xs sm:text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToBuild();
            }}
            className="font-jua px-5 py-2.5 text-xs sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl transition-all shadow-md"
          >
            장소 소개하러 가기 ✏️
          </button>
        </div>
      </div>
    </div>
  );
};
