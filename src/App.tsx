/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SpaceItem, ViewMode, FloorNumber, StudentCharacter, SpaceComment, CommentReaction } from './types';
import { INITIAL_SPACES } from './data/defaultSpaces';
import { DEFAULT_STUDENT_CHARACTER } from './data/characterData';
import { INITIAL_COMMENTS } from './data/defaultComments';
import { Navbar } from './components/Navbar';
import { ExperienceView } from './components/ExperienceView';
import { BuildView } from './components/BuildView';
import { AdminView } from './components/AdminView';
import { SpaceDetailModal } from './components/SpaceDetailModal';
import { GuideModal } from './components/GuideModal';
import { CharacterCustomizerModal } from './components/CharacterCustomizerModal';

const STORAGE_KEY_SPACES = 'school_spaces_data_v2';
const STORAGE_KEY_STAMPS = 'school_spaces_stamps_v1';
const STORAGE_KEY_LIKES = 'school_spaces_likes_v1';
const STORAGE_KEY_CHARACTER = 'school_spaces_character_v1';
const STORAGE_KEY_COMMENTS = 'school_spaces_comments_v1';

export default function App() {
  // Main spaces list
  const [spaces, setSpaces] = useState<SpaceItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SPACES) || localStorage.getItem('school_spaces_data_v1');
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

  // Visited stamp IDs
  const [visitedStampIds, setVisitedStampIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STAMPS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Liked space IDs
  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LIKES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Student Customizable Character
  const [character, setCharacter] = useState<StudentCharacter>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHARACTER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STUDENT_CHARACTER;
  });

  // Space Comments & School Guestbook
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

  // Navigation & View Mode
  const [currentMode, setCurrentMode] = useState<ViewMode>('experience');

  // Modals state
  const [activeDetailSpace, setActiveDetailSpace] = useState<SpaceItem | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCharacterCustomizerOpen, setIsCharacterCustomizerOpen] = useState(false);

  // Build mode edit states
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [selectedFloorForBuild, setSelectedFloorForBuild] = useState<FloorNumber>(1);

  // Sync spaces to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPACES, JSON.stringify(spaces));
    } catch (e) {
      console.warn('LocalStorage quota limit reached or unavailable', e);
    }
  }, [spaces]);

  // Sync stamps to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STAMPS, JSON.stringify(visitedStampIds));
    } catch (e) {
      console.error(e);
    }
  }, [visitedStampIds]);

  // Sync likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likedIds));
    } catch (e) {
      console.error(e);
    }
  }, [likedIds]);

  // Sync character to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHARACTER, JSON.stringify(character));
    } catch (e) {
      console.error(e);
    }
  }, [character]);

  // Sync comments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
    } catch (e) {
      console.error(e);
    }
  }, [comments]);

  // Handle Add Comment (Place review or School Guestbook)
  const handleAddComment = (
    spaceId: string,
    content: string,
    reactionTag?: CommentReaction,
    spaceName?: string,
    floor?: FloorNumber
  ) => {
    const newComment: SpaceComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      spaceId,
      spaceName: spaceName || (spaces.find((s) => s.id === spaceId)?.name),
      floor: floor || (spaces.find((s) => s.id === spaceId)?.floor),
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
  };

  // Handle Like Comment
  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Handle Delete Comment
  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Handle Likes
  const handleLikeSpace = (id: string) => {
    if (likedIds.includes(id)) return;
    setLikedIds((prev) => [...prev, id]);
    setSpaces((prev) =>
      prev.map((s) => (s.id === id ? { ...s, likes: s.likes + 1 } : s))
    );
    if (activeDetailSpace?.id === id) {
      setActiveDetailSpace((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
    }
  };

  // Handle Toggle Stamp
  const handleToggleStamp = (id: string) => {
    setVisitedStampIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle Go To Build for specific floor
  const handleGoToBuildForFloor = (floor: FloorNumber) => {
    setSelectedFloorForBuild(floor);
    setEditingSpaceId(null);
    setCurrentMode('build');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Edit Space from Detail Modal or List
  const handleEditSpace = (space: SpaceItem) => {
    setActiveDetailSpace(null);
    setEditingSpaceId(space.id);
    setSelectedFloorForBuild(space.floor);
    setCurrentMode('build');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Save (Create or Update) in Build View
  const handleSaveSpace = (
    spaceData: Omit<SpaceItem, 'id' | 'createdAt' | 'updatedAt' | 'likes'>,
    id?: string
  ) => {
    const now = new Date().toISOString();

    if (id) {
      // Update existing space
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                ...spaceData,
                status: 'pending', // Requires re-approval upon edit
                updatedAt: now,
              }
            : s
        )
      );
    } else {
      // Create new space
      const newSpace: SpaceItem = {
        ...spaceData,
        id: `space-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        status: 'pending', // Teacher approval required
        createdAt: now,
        updatedAt: now,
        likes: 0,
      };
      setSpaces((prev) => [newSpace, ...prev]);
    }
  };

  // Handle Approve Space (Teacher / Admin)
  const handleApproveSpace = (id: string) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: 'approved', reviewFeedback: undefined, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  // Handle Reject Space (Teacher / Admin)
  const handleRejectSpace = (id: string, feedback: string) => {
    setSpaces((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: 'rejected', reviewFeedback: feedback, updatedAt: new Date().toISOString() }
          : s
      )
    );
  };

  // Handle Delete Space
  const handleDeleteSpace = (id: string) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  // Handle Reset to Default 4 Floor Templates
  const handleResetToDefaults = () => {
    if (confirm('모든 데이터를 초기 층별 4개 예시 상태로 되돌리시겠습니까? (직접 추가한 공간은 삭제됩니다)')) {
      setSpaces(INITIAL_SPACES);
      setVisitedStampIds([]);
      setLikedIds([]);
    }
  };

  // Handle Export Data as JSON
  const handleExportData = () => {
    const jsonStr = JSON.stringify(spaces, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_spaces_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import Data from JSON
  const handleImportData = (newSpaces: SpaceItem[]) => {
    setSpaces(newSpaces);
  };

  // Count pending items for badge
  const pendingCount = spaces.filter((s) => s.status === 'pending').length;

  // Calculate stamped floors
  const approvedSpaces = spaces.filter((s) => s.status === 'approved');
  const floorStampedMap: Record<number, boolean> = {
    1: approvedSpaces.filter((s) => s.floor === 1).some((s) => visitedStampIds.includes(s.id)),
    2: approvedSpaces.filter((s) => s.floor === 2).some((s) => visitedStampIds.includes(s.id)),
    3: approvedSpaces.filter((s) => s.floor === 3).some((s) => visitedStampIds.includes(s.id)),
    4: approvedSpaces.filter((s) => s.floor === 4).some((s) => visitedStampIds.includes(s.id)),
  };
  const stampedFloorCount = Object.values(floorStampedMap).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fffdf5] text-slate-900 selection:bg-amber-200 selection:text-amber-950">
      {/* Universal Top Bar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCharacterCustomizer={() => setIsCharacterCustomizerOpen(true)}
        character={character}
        pendingCount={pendingCount}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6">
        {currentMode === 'experience' && (
          <ExperienceView
            spaces={spaces}
            onOpenSpaceDetail={(space) => setActiveDetailSpace(space)}
            onGoToBuildForFloor={handleGoToBuildForFloor}
            onLikeSpace={handleLikeSpace}
            visitedStampIds={visitedStampIds}
            character={character}
            onOpenCharacterCustomizer={() => setIsCharacterCustomizerOpen(true)}
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
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchToExperience={() => {
              setCurrentMode('experience');
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onOpenSpaceDetail={(space) => setActiveDetailSpace(space)}
          />
        )}
      </main>

      {/* Detail Modal */}
      <SpaceDetailModal
        space={activeDetailSpace}
        onClose={() => setActiveDetailSpace(null)}
        onLike={handleLikeSpace}
        onToggleStamp={handleToggleStamp}
        isStamped={activeDetailSpace ? visitedStampIds.includes(activeDetailSpace.id) : false}
        onEdit={handleEditSpace}
        characterName={character.name}
        character={character}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
        onDeleteComment={handleDeleteComment}
      />

      {/* Student Character Customizer Modal */}
      <CharacterCustomizerModal
        isOpen={isCharacterCustomizerOpen}
        onClose={() => setIsCharacterCustomizerOpen(false)}
        character={character}
        onSaveCharacter={(updated) => setCharacter(updated)}
        stampedFloorCount={stampedFloorCount}
      />

      {/* Guide Curriculum Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onGoToBuild={() => {
          setSelectedFloorForBuild(1);
          setEditingSpaceId(null);
          setCurrentMode('build');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="border-t-2 border-amber-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-jua text-sm text-slate-800">우리 학교 공간 탐험대 🏫</span>
            <span>·</span>
            <span className="font-medium text-slate-600">학생들이 직접 만들고 기록하는 우리 학교 보물창고</span>
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
