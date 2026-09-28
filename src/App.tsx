/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useEffect, useState} from 'react';
import {
  CommentReaction,
  FloorNumber,
  SpaceComment,
  SpaceItem,
  StudentCharacter,
  ViewMode,
} from './types';
import {INITIAL_SPACES} from './data/defaultSpaces';
import {DEFAULT_STUDENT_CHARACTER} from './data/characterData';
import {INITIAL_COMMENTS} from './data/defaultComments';
import {Navbar} from './components/Navbar';
import {ExperienceView} from './components/ExperienceView';
import {BuildView} from './components/BuildView';
import {AdminView} from './components/AdminView';
import {SpaceDetailModal} from './components/SpaceDetailModal';
import {GuideModal} from './components/GuideModal';
import {CharacterCustomizerModal} from './components/CharacterCustomizerModal';
import {
  deleteCommentRealtime,
  deleteSpaceRealtime,
  incrementCommentLikeRealtime,
  incrementSpaceLikeRealtime,
  replaceAllSpacesRealtime,
  reviewSpaceRealtime,
  seedRealtimeDatabaseIfEmpty,
  subscribeCommentsRealtime,
  subscribeSpacesRealtime,
  upsertCommentRealtime,
  upsertSpaceRealtime,
} from './services/firebaseData';
import {
  ensureAnonymousFirebaseUser,
  isFirebaseConfigured,
} from './lib/firebase';

const STORAGE_KEY_SPACES = 'school_spaces_data_v2';
const STORAGE_KEY_STAMPS = 'school_spaces_stamps_v1';
const STORAGE_KEY_LIKES = 'school_spaces_likes_v1';
const STORAGE_KEY_CHARACTER = 'school_spaces_character_v1';
const STORAGE_KEY_COMMENTS = 'school_spaces_comments_v1';

function runRemote(task: Promise<unknown>, label: string) {
  if (!isFirebaseConfigured) return;

  void task.catch((error) => {
    console.error(`[Realtime Database] ${label} 실패`, error);
    window.alert(
      '온라인 저장에 실패했습니다. 인터넷 연결과 Firebase 설정을 확인한 뒤 다시 시도해 주세요.'
    );
  });
}

export default function App() {
  // Firebase가 아직 설정되지 않은 경우에도 기존 localStorage 방식으로 그대로 작동합니다.
  // Firebase가 설정되면 이 값은 최초 시드/화면 표시용이며 곧 실시간 DB 값으로 교체됩니다.
  const [spaces, setSpaces] = useState<SpaceItem[]>(() => {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY_SPACES) ||
        localStorage.getItem('school_spaces_data_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load spaces from localStorage', e);
    }
    return INITIAL_SPACES;
  });

  const [visitedStampIds, setVisitedStampIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STAMPS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LIKES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [character, setCharacter] = useState<StudentCharacter>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHARACTER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDENT_CHARACTER;
  });

  const [comments, setComments] = useState<SpaceComment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load comments from localStorage', e);
    }
    return INITIAL_COMMENTS;
  });

  const [currentMode, setCurrentMode] = useState<ViewMode>('experience');

  const [activeDetailSpace, setActiveDetailSpace] =
    useState<SpaceItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCharacterCustomizerOpen, setIsCharacterCustomizerOpen] =
    useState(false);

  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [selectedFloorForBuild, setSelectedFloorForBuild] =
    useState<FloorNumber>(1);

  /**
   * Firebase Realtime Database 연결.
   * UI/레이아웃은 바꾸지 않고 데이터 원본만 실시간 DB로 교체합니다.
   */
  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.info(
        'Firebase 설정이 비어 있어 기존 localStorage 모드로 실행합니다.'
      );
      return;
    }

    let disposed = false;
    let unsubscribeSpaces: (() => void) | undefined;
    let unsubscribeComments: (() => void) | undefined;

    const connect = async () => {
      await ensureAnonymousFirebaseUser();

      // DB가 비어 있는 최초 1회에만 현재 브라우저 자료를 업로드합니다.
      await seedRealtimeDatabaseIfEmpty(spaces, comments);
      if (disposed) return;

      unsubscribeSpaces = subscribeSpacesRealtime(
        (nextSpaces) => {
          if (!disposed) setSpaces(nextSpaces);
        },
        (error) => console.error('공간 실시간 구독 오류', error)
      );

      unsubscribeComments = subscribeCommentsRealtime(
        (nextComments) => {
          if (!disposed) setComments(nextComments);
        },
        (error) => console.error('댓글 실시간 구독 오류', error)
      );
    };

    void connect().catch((error) => {
      console.error('Firebase Realtime Database 연결 실패', error);
      // 연결이 실패해도 기존 화면과 localStorage 데이터로 계속 사용할 수 있습니다.
    });

    return () => {
      disposed = true;
      unsubscribeSpaces?.();
      unsubscribeComments?.();
    };
    // 최초 1회 연결만 수행합니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Firebase 모드에서는 공유 데이터(spaces/comments)를 localStorage에
   * 계속 복제하지 않습니다. 큰 base64 사진 때문에 브라우저 저장공간이
   * 가득 차는 문제를 예방합니다.
   */
  useEffect(() => {
    if (isFirebaseConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEY_SPACES, JSON.stringify(spaces));
    } catch (e) {
      console.warn('LocalStorage quota limit reached or unavailable', e);
    }
  }, [spaces]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_STAMPS,
        JSON.stringify(visitedStampIds)
      );
    } catch (e) {
      console.error(e);
    }
  }, [visitedStampIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likedIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CHARACTER,
        JSON.stringify(character)
      );
    } catch (e) {
      console.error(e);
    }
  }, [character]);

  useEffect(() => {
    if (isFirebaseConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    } catch (e) {
      console.error(e);
    }
  }, [comments]);

  // 다른 학생/교사 기기에서 수정된 내용이 상세 팝업에도 실시간 반영되도록 동기화합니다.
  useEffect(() => {
    const activeId = activeDetailSpace?.id;
    if (!activeId) return;

    const latest = spaces.find((space) => space.id === activeId);
    if (latest) {
      setActiveDetailSpace(latest);
    } else {
      setActiveDetailSpace(null);
    }
    // activeDetailSpace 전체 객체를 의존성으로 넣으면 불필요한 반복 렌더가 생길 수 있습니다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaces, activeDetailSpace?.id]);

  const handleAddComment = (
    spaceId: string,
    content: string,
    reactionTag?: CommentReaction,
    spaceName?: string,
    floor?: FloorNumber
  ) => {
    const newComment: SpaceComment = {
      id: `comment-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)}`,
      spaceId,
      spaceName:
        spaceName || spaces.find((s) => s.id === spaceId)?.name,
      floor: floor || spaces.find((s) => s.id === spaceId)?.floor,
      authorName: character.name,
      authorGradeClass: character.gradeClass,
      avatar: {
        buddyId: character.buddyId,
        outfit: character.outfit,
        headwear: character.headwear,
        toolItem: character.toolItem,
        expression: character.expression,
        themeColor: character.themeColor,
      },
      content,
      reactionTag,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);

    if (isFirebaseConfigured) {
      runRemote(
        upsertCommentRealtime(newComment),
        '댓글 저장'
      );
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? {...c, likes: c.likes + 1} : c
      )
    );

    if (isFirebaseConfigured) {
      runRemote(
        incrementCommentLikeRealtime(commentId),
        '댓글 좋아요'
      );
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    if (isFirebaseConfigured) {
      runRemote(
        deleteCommentRealtime(commentId),
        '댓글 삭제'
      );
    }
  };

  const handleLikeSpace = (id: string) => {
    if (likedIds.includes(id)) return;

    setLikedIds((prev) => [...prev, id]);
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? {...s, likes: s.likes + 1} : s))
    );

    if (activeDetailSpace?.id === id) {
      setActiveDetailSpace((prev) =>
        prev ? {...prev, likes: prev.likes + 1} : null
      );
    }

    if (isFirebaseConfigured) {
      runRemote(
        incrementSpaceLikeRealtime(id),
        '공간 좋아요'
      );
    }
  };

  const handleToggleStamp = (id: string) => {
    setVisitedStampIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleGoToBuildForFloor = (floor: FloorNumber) => {
    setSelectedFloorForBuild(floor);
    setEditingSpaceId(null);
    setCurrentMode('build');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleEditSpace = (space: SpaceItem) => {
    setActiveDetailSpace(null);
    setEditingSpaceId(space.id);
    setSelectedFloorForBuild(space.floor);
    setCurrentMode('build');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleSaveSpace = (
    spaceData: Omit<
      SpaceItem,
      'id' | 'createdAt' | 'updatedAt' | 'likes'
    >,
    id?: string
  ) => {
    const now = new Date().toISOString();

    if (id) {
      const existing = spaces.find((space) => space.id === id);
      if (!existing) return;

      const updatedSpace: SpaceItem = {
        ...existing,
        ...spaceData,
        status: 'pending',
        updatedAt: now,
      };

      setSpaces((prev) =>
        prev.map((space) =>
          space.id === id ? updatedSpace : space
        )
      );

      if (isFirebaseConfigured) {
        runRemote(
          upsertSpaceRealtime(updatedSpace),
          '공간 수정'
        );
      }
    } else {
      const newSpace: SpaceItem = {
        ...spaceData,
        id: `space-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 6)}`,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        likes: 0,
      };

      setSpaces((prev) => [newSpace, ...prev]);

      if (isFirebaseConfigured) {
        runRemote(
          upsertSpaceRealtime(newSpace),
          '공간 등록'
        );
      }
    }
  };

  const handleApproveSpace = (id: string) => {
    const updatedAt = new Date().toISOString();

    setSpaces((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'approved',
              reviewFeedback: undefined,
              updatedAt,
            }
          : s
      )
    );

    if (isFirebaseConfigured) {
      runRemote(
        reviewSpaceRealtime(id, 'approved'),
        '공간 승인'
      );
    }
  };

  const handleRejectSpace = (id: string, feedback: string) => {
    const updatedAt = new Date().toISOString();

    setSpaces((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'rejected',
              reviewFeedback: feedback,
              updatedAt,
            }
          : s
      )
    );

    if (isFirebaseConfigured) {
      runRemote(
        reviewSpaceRealtime(id, 'rejected', feedback),
        '공간 수정 요청'
      );
    }
  };

  const handleDeleteSpace = (id: string) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));

    if (isFirebaseConfigured) {
      runRemote(
        deleteSpaceRealtime(id),
        '공간 삭제'
      );
    }
  };

  const handleResetToDefaults = () => {
    if (
      confirm(
        '모든 데이터를 초기 층별 4개 예시 상태로 되돌리시겠습니까? (직접 추가한 공간은 삭제됩니다)'
      )
    ) {
      setSpaces(INITIAL_SPACES);
      setVisitedStampIds([]);
      setLikedIds([]);

      if (isFirebaseConfigured) {
        runRemote(
          replaceAllSpacesRealtime(INITIAL_SPACES),
          '공간 초기화'
        );
      }
    }
  };

  const handleExportData = () => {
    const jsonStr = JSON.stringify(spaces, null, 2);
    const blob = new Blob([jsonStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_spaces_backup_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (newSpaces: SpaceItem[]) => {
    setSpaces(newSpaces);

    if (isFirebaseConfigured) {
      runRemote(
        replaceAllSpacesRealtime(newSpaces),
        '공간 데이터 가져오기'
      );
    }
  };

  const pendingCount = spaces.filter(
    (s) => s.status === 'pending'
  ).length;

  const approvedSpaces = spaces.filter(
    (s) => s.status === 'approved'
  );

  const floorStampedMap: Record<number, boolean> = {
    1: approvedSpaces
      .filter((s) => s.floor === 1)
      .some((s) => visitedStampIds.includes(s.id)),
    2: approvedSpaces
      .filter((s) => s.floor === 2)
      .some((s) => visitedStampIds.includes(s.id)),
    3: approvedSpaces
      .filter((s) => s.floor === 3)
      .some((s) => visitedStampIds.includes(s.id)),
    4: approvedSpaces
      .filter((s) => s.floor === 4)
      .some((s) => visitedStampIds.includes(s.id)),
  };

  const stampedFloorCount =
    Object.values(floorStampedMap).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf5] text-slate-900 selection:bg-amber-200 selection:text-amber-950">
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCharacterCustomizer={() =>
          setIsCharacterCustomizerOpen(true)
        }
        character={character}
        pendingCount={pendingCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        {currentMode === 'experience' && (
          <ExperienceView
            spaces={spaces}
            onOpenSpaceDetail={(space) =>
              setActiveDetailSpace(space)
            }
            onGoToBuildForFloor={handleGoToBuildForFloor}
            onLikeSpace={handleLikeSpace}
            visitedStampIds={visitedStampIds}
            character={character}
            onOpenCharacterCustomizer={() =>
              setIsCharacterCustomizerOpen(true)
            }
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onDeleteComment={handleDeleteComment}
          />
        )}

        {currentMode === 'build' && (
          <BuildView
            spaces={spaces}
            editingSpaceId={editingSpaceId}
            initialFloor={selectedFloorForBuild}
            onSaveSpace={handleSaveSpace}
            onCancelEdit={() => setEditingSpaceId(null)}
            onSelectEditSpace={(id) => {
              setEditingSpaceId(id);
              window.scrollTo({top: 0, behavior: 'smooth'});
            }}
            onSwitchToExperience={() => {
              setCurrentMode('experience');
              window.scrollTo({top: 0, behavior: 'smooth'});
            }}
            character={character}
          />
        )}

        {currentMode === 'admin' && (
          <AdminView
            spaces={spaces}
            onApproveSpace={handleApproveSpace}
            onRejectSpace={handleRejectSpace}
            onDeleteSpace={handleDeleteSpace}
            onResetToDefaults={handleResetToDefaults}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onOpenSpaceDetail={(space) =>
              setActiveDetailSpace(space)
            }
          />
        )}
      </main>

      <SpaceDetailModal
        space={activeDetailSpace}
        onClose={() => setActiveDetailSpace(null)}
        onLike={handleLikeSpace}
        onToggleStamp={handleToggleStamp}
        isStamped={
          activeDetailSpace
            ? visitedStampIds.includes(activeDetailSpace.id)
            : false
        }
        onEdit={handleEditSpace}
        characterName={character.name}
        character={character}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onDeleteComment={handleDeleteComment}
      />

      <CharacterCustomizerModal
        isOpen={isCharacterCustomizerOpen}
        onClose={() => setIsCharacterCustomizerOpen(false)}
        character={character}
        onSaveCharacter={(updated) => setCharacter(updated)}
        stampedFloorCount={stampedFloorCount}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onGoToBuild={() => {
          setSelectedFloorForBuild(1);
          setEditingSpaceId(null);
          setCurrentMode('build');
          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
      />

      <footer className="border-t-2 border-amber-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-jua text-sm text-slate-800">
              우리 학교 공간 탐험대 🏫
            </span>
            <span>·</span>
            <span className="font-medium text-slate-600">
              학생들이 직접 만들고 기록하는 우리 학교 보물창고
            </span>
          </div>

          <div className="font-jua flex items-center gap-4 text-xs sm:text-sm">
            <button
              onClick={() => setCurrentMode('experience')}
              className="text-slate-600 hover:text-emerald-700 transition-colors"
            >
              학교 둘러보기
            </button>

            <button
              onClick={() => setCurrentMode('build')}
              className="text-slate-600 hover:text-emerald-700 transition-colors"
            >
              내가 직접 소개하기
            </button>

            <button
              onClick={() => setCurrentMode('admin')}
              className="text-slate-600 hover:text-indigo-700 transition-colors"
            >
              선생님 확인방
            </button>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-slate-600 hover:text-amber-700 transition-colors"
            >
              활동 안내서
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
