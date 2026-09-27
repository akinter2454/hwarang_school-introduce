import React, { useState } from 'react';
import { SpaceItem, FloorNumber } from '../types';
import { 
  ShieldCheck, 
  Check, 
  X, 
  AlertCircle, 
  Trash2, 
  MessageSquare, 
  Eye, 
  RotateCcw, 
  Download, 
  Upload, 
  Lock, 
  CheckCircle2,
  Users,
  Building,
  Star
} from 'lucide-react';

interface AdminViewProps {
  spaces: SpaceItem[];
  onApproveSpace: (id: string) => void;
  onRejectSpace: (id: string, feedback: string) => void;
  onDeleteSpace: (id: string) => void;
  onResetToDefaults: () => void;
  onExportData: () => void;
  onImportData: (data: SpaceItem[]) => void;
  onOpenSpaceDetail: (space: SpaceItem) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  spaces,
  onApproveSpace,
  onRejectSpace,
  onDeleteSpace,
  onResetToDefaults,
  onExportData,
  onImportData,
  onOpenSpaceDetail,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Filter queue tab
  const [queueTab, setQueueTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Reviewing modal target
  const [reviewTarget, setReviewTarget] = useState<SpaceItem | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Pin verify handler (Default pin: 7777)
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '7777') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Quick bypass for evaluation
  const handleQuickLogin = () => {
    setIsAuthenticated(true);
    setAuthError(false);
  };

  const pendingList = spaces.filter((s) => s.status === 'pending');
  const approvedList = spaces.filter((s) => s.status === 'approved');
  const rejectedList = spaces.filter((s) => s.status === 'rejected');

  const currentList = {
    pending: pendingList,
    approved: approvedList,
    rejected: rejectedList,
  }[queueTab];

  // Open review modal
  const handleOpenReview = (space: SpaceItem) => {
    setReviewTarget(space);
    setFeedbackText(space.reviewFeedback || '');
  };

  // Confirm Approval
  const handleConfirmApproval = (id: string) => {
    onApproveSpace(id);
    setReviewTarget(null);
  };

  // Confirm Rejection with feedback
  const handleConfirmRejection = (id: string) => {
    if (!feedbackText.trim()) {
      alert('학생에게 전달할 지도 피드백 코멘트를 입력해 주세요.');
      return;
    }
    onRejectSpace(id, feedbackText.trim());
    setReviewTarget(null);
  };

  // File import handler
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          alert('데이터가 성공적으로 복원되었습니다.');
        }
      } catch (err) {
        alert('올바른 JSON 데이터 형식이 아닙니다.');
      }
    };
    reader.readAsText(file);
  };

  // If not authenticated, show password prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border-2 border-indigo-200 p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900">선생님 확인방 (승인 관리)</h2>
          <p className="text-xs text-slate-500 font-medium">
            초등학생들이 제출한 학교 공간 소개글을 검토하고 승인하는 교사용 화면입니다.
          </p>
        </div>

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700">선생님 인증 비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 (기본: 7777)"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setAuthError(false);
              }}
              className="w-full px-4 py-3 text-center tracking-widest text-lg bg-slate-50 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-indigo-600 font-bold"
            />
            {authError && (
              <p className="text-xs text-rose-600 font-bold pt-1 text-center">
                비밀번호가 올바르지 않습니다. (기본 비밀번호: 7777)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-colors shadow-md cursor-pointer"
          >
            선생님 모드 시작하기
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleQuickLogin}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
          >
            체험용 원클릭 빠른 접속 (비밀번호 생략)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                선생님 관리 모드
              </span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-slate-400 hover:text-slate-600 underline font-medium"
              >
                로그아웃
              </button>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              학생 제출 공간 심사 & 승인 센터
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              학생들이 올린 사진에 얼굴/명찰 등 개인정보가 없는지 확인하고 승인하면 [학교 둘러보기]에 즉시 게시됩니다.
            </p>
          </div>

          {/* Quick Data Management Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExportData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="데이터 백업 JSON 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>백업 저장</span>
            </button>
            <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>불러오기</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
            <button
              onClick={onResetToDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
              title="초기 4개 층별 예시 상태로 복원"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>초기 예시로 복원</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500">전체 등록된 공간</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
              {spaces.length}곳
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-xs font-bold text-amber-800">검토 대기 (승인 필요)</span>
            <div className="text-2xl font-black text-amber-700 mt-0.5 font-mono">
              {pendingList.length}건
            </div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800">체험관 공식 공개 중</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5 font-mono">
              {approvedList.length}건
            </div>
          </div>
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
            <span className="text-xs font-bold text-rose-800">수정 피드백 전달</span>
            <div className="text-2xl font-black text-rose-700 mt-0.5 font-mono">
              {rejectedList.length}건
            </div>
          </div>
        </div>
      </div>

      {/* Queue Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setQueueTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black rounded-2xl transition-colors ${
            queueTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>검토 대기 목록</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-black bg-white/40">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setQueueTab('approved')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black rounded-2xl transition-colors ${
            queueTab === 'approved'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>공개 승인 완료</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-black bg-white/20">
            {approvedList.length}
          </span>
        </button>

        <button
          onClick={() => setQueueTab('rejected')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black rounded-2xl transition-colors ${
            queueTab === 'rejected'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>수정 요청 목록</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-mono font-black bg-white/20">
            {rejectedList.length}
          </span>
        </button>
      </div>

      {/* Queue Items List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        {currentList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
            <p className="text-sm font-bold">해당 상태의 공간 소개글이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentList.map((space) => (
              <div
                key={space.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
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
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono font-bold">
                      📸 {space.images.length}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {space.floor}층
                      </span>
                      <h3 className="font-black text-slate-900 text-base">{space.name}</h3>
                      {space.isTemplateExample && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                          기본 템플릿
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 font-medium">{space.oneLineIntro}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5 font-medium">
                      <span>작성자: <strong className="text-slate-700">{space.author}</strong></span>
                      {space.studentGroup && <span>모둠: {space.studentGroup}</span>}
                      <span>사진 {space.images.length}장 등록됨</span>
                    </div>

                    {space.reviewFeedback && (
                      <p className="text-xs text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 mt-1 font-medium">
                        <strong>선생님 피드백:</strong> {space.reviewFeedback}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onOpenSpaceDetail(space)}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>상세보기</span>
                  </button>

                  <button
                    onClick={() => handleOpenReview(space)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>심사 & 피드백</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`'${space.name}' 소개글을 삭제하시겠습니까?`)) {
                        onDeleteSpace(space.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  {reviewTarget.floor}층 심사 대상
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  [{reviewTarget.name}] 학생 소개글 심사
                </h2>
              </div>
              <button
                onClick={() => setReviewTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student metadata */}
            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-700 border border-slate-200 font-medium">
              <p>
                <strong>작성자:</strong> {reviewTarget.author}{' '}
                {reviewTarget.studentGroup && `(소속 모둠: ${reviewTarget.studentGroup})`}
              </p>
              <p>
                <strong>한 줄 소개:</strong> {reviewTarget.oneLineIntro}
              </p>
            </div>

            {/* Photos Check (Multiple Photos Review) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800">
                  📸 등록된 사진 검토 ({reviewTarget.images.length}장) - 학생 얼굴, 명찰 노출 여부 점검
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {reviewTarget.images.map((img, i) => (
                  <div key={i} className="relative aspect-4/3 rounded-xl overflow-hidden border bg-slate-100">
                    <img
                      src={img}
                      alt="검토 사진"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono font-bold">
                      사진 {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content summary */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                <span className="font-black text-slate-900 block">📖 상세 설명</span>
                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {reviewTarget.description}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                <span className="font-black text-slate-900 block">🌟 특별한 점</span>
                <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {reviewTarget.specialPoint}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                <span className="font-black text-slate-900 block">⏰ 이용 방법 & 지켜야 할 약속</span>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {reviewTarget.usageGuide} / {reviewTarget.rules}
                </p>
              </div>
            </div>

            {/* Teacher Feedback input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>선생님 지도 피드백 코멘트 (수정 요청 시 필수 입력)</span>
              </label>
              <textarea
                rows={2}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="예: 2번 사진에 친구 얼굴이 살짝 보이니까 다른 각도 사진으로 바꿔보자! 설명글은 아주 훌륭해요! 👍"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-2xl border-2 border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            {/* Decision Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                닫기
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmRejection(reviewTarget.id)}
                  className="px-4 py-2.5 text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 rounded-2xl transition-colors"
                >
                  수정 요청 (반려)
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmApproval(reviewTarget.id)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md transition-all hover:scale-102"
                >
                  <Check className="w-4 h-4" />
                  <span>승인하고 체험관에 공개하기 🎉</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
