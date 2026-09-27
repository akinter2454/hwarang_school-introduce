import React from 'react';
import {clearAppLocalData} from '../utils/persistence';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {hasError: false};

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return {hasError: true};
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('School Space app render error', error, info);
  }

  private reload = () => {
    window.location.reload();
  };

  private resetAndReload = () => {
    const ok = window.confirm(
      '이 기기에 저장된 캐릭터, 방문 도장, 좋아요, 댓글, 작성 중인 공간 데이터를 초기화하고 다시 시작할까요?'
    );
    if (!ok) return;

    clearAppLocalData();
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    // This UI is shown only if the app crashes. Normal app design is untouched.
    return (
      <main className="min-h-screen bg-[#fffdf5] text-slate-900 flex items-center justify-center p-5">
        <section className="w-full max-w-lg rounded-3xl border-2 border-amber-200 bg-white p-6 sm:p-8 shadow-xl text-center space-y-5">
          <div className="text-5xl" aria-hidden="true">🛠️</div>
          <div className="space-y-2">
            <h1 className="font-jua text-2xl text-slate-950">앱을 다시 불러올게요</h1>
            <p className="text-sm leading-relaxed text-slate-600 font-medium">
              이 기기에 남아 있는 예전 저장 데이터가 현재 앱과 맞지 않거나,
              브라우저 저장 공간에 문제가 생겼을 수 있어요.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={this.reload}
              className="font-jua rounded-2xl bg-amber-400 px-4 py-3 text-slate-950 shadow-sm hover:bg-amber-500 transition-colors"
            >
              다시 불러오기
            </button>
            <button
              type="button"
              onClick={this.resetAndReload}
              className="font-jua rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              저장 데이터 초기화
            </button>
          </div>

          <p className="text-xs text-slate-400">
            초기화는 이 브라우저에 저장된 데이터에만 적용됩니다.
          </p>
        </section>
      </main>
    );
  }
}
