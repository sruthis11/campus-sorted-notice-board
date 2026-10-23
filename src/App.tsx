/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Notice, Registration } from './types';
import { Navbar } from './components/Navbar';
import { CorkBoard } from './components/CorkBoard';
import { DecodedDetailView } from './components/DecodedDetailView';
import { TimelineRibbon } from './components/TimelineRibbon';
import { RegisterModal } from './components/RegisterModal';
import { PinNoticeModal } from './components/PinNoticeModal';
import { PosterModal } from './components/PosterModal';
import { PosterAutomationModal } from './components/PosterAutomationModal';
import { ConflictRadarModal } from './components/ConflictRadarModal';
import { NoticeCard } from './components/NoticeCard';
import { BabyOinkLogin } from './components/BabyOinkLogin';
import { AiNoticeAgent } from './components/AiNoticeAgent';
import { Sparkles, Calendar, Layers, Bookmark, ArrowUp, Loader2, Wind, Bot } from 'lucide-react';

export default function App() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Views & Filters
  const [activeNavView, setActiveNavView] = useState<'board' | 'decoded' | 'timeline' | 'bookmarks' | 'login' | 'agent'>('board');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loupeEnabled, setLoupeEnabled] = useState(true);
  const [breezeEnabled, setBreezeEnabled] = useState(true);

  // User state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('cs_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Bookmarks (saved locally)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cs_bookmarks');
      return saved ? JSON.parse(saved) : ['project-expo'];
    } catch {
      return ['project-expo'];
    }
  });

  // User Registered Passes
  const [userRegistrations, setUserRegistrations] = useState<Registration[]>([]);

  // Modals & Drawers
  const [registerModalNotice, setRegisterModalNotice] = useState<Notice | null>(null);
  const [posterModalNotice, setPosterModalNotice] = useState<Notice | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState(false);
  const [isPosterAutomationOpen, setIsPosterAutomationOpen] = useState(false);
  const [publishToast, setPublishToast] = useState<string | null>(null);

  const decodedSectionRef = useRef<HTMLDivElement>(null);
  const boardSectionRef = useRef<HTMLDivElement>(null);

  // Fetch notices from backend
  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      if (data.success && Array.isArray(data.notices)) {
        setNotices(data.notices);
        // Default selection to first notice if none
        if (!selectedNotice && data.notices.length > 0) {
          setSelectedNotice(data.notices[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('cs_bookmarks', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Card click handler (smooth transition to Decoded View)
  const handleSelectNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    // Smooth scroll down to decoded section if on board
    setTimeout(() => {
      if (decodedSectionRef.current) {
        decodedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleReturnToBoard = () => {
    setActiveNavView('board');
    if (boardSectionRef.current) {
      boardSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNoticePinned = (newNotice: Notice) => {
    setNotices((prev) => [newNotice, ...prev]);
    setSelectedNotice(newNotice);
    setPublishToast(`Notice "${newNotice.title}" verified & pinned to board!`);
    setTimeout(() => setPublishToast(null), 4500);
    setTimeout(() => {
      if (decodedSectionRef.current) {
        decodedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleRegistrationSuccess = (reg: Registration, notice: Notice) => {
    setUserRegistrations((prev) => [reg, ...prev]);
    setNotices((prev) =>
      prev.map((n) => (n.id === notice.id ? { ...n, isRegistered: true, registeredCount: n.registeredCount + 1 } : n))
    );
  };

  const handleLoginSuccess = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('cs_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setActiveNavView('board');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('cs_user');
    } catch (e) {
      console.error(e);
    }
  };

  const conflictCount = notices.filter(n => Boolean(n.conflictNotice)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#242120] text-amber-100 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-3" />
        <h2 className="font-serif text-lg font-bold">Assembling Campus Notice Board...</h2>
        <p className="text-xs text-amber-200/60 mt-1">Loading pinned circulars and schedules</p>
      </div>
    );
  }

  // If user selected Baby Oink Login view
  if (activeNavView === 'login') {
    return (
      <BabyOinkLogin
        onSuccessLogin={handleLoginSuccess}
        onBackToBoard={handleReturnToBoard}
      />
    );
  }

  // If user selected dedicated full-screen AI Notice Agent view
  if (activeNavView === 'agent') {
    return (
      <div className="min-h-screen bg-[#242120] text-slate-900 flex flex-col font-sans selection:bg-amber-300 selection:text-amber-950">
        <Navbar
          onOpenPinModal={() => setIsPinModalOpen(true)}
          onOpenConflicts={() => setIsConflictModalOpen(true)}
          conflictCount={conflictCount}
          activeView={activeNavView}
          onViewChange={(view) => {
            setActiveNavView(view);
            if (view === 'board') handleReturnToBoard();
          }}
          bookmarksCount={bookmarkedIds.length}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenPosterAutomation={() => setIsPosterAutomationOpen(true)}
        />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
          <AiNoticeAgent
            notices={notices}
            onSelectNotice={(n) => {
              setSelectedNotice(n);
              setActiveNavView('decoded');
              setTimeout(() => {
                decodedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            onOpenRegister={(n) => setRegisterModalNotice(n)}
            onClose={handleReturnToBoard}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#242120] text-slate-900 flex flex-col font-sans selection:bg-amber-300 selection:text-amber-950">
      {/* 3-Zone Top Navigation Contract */}
      <Navbar
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenConflicts={() => setIsConflictModalOpen(true)}
        conflictCount={conflictCount}
        activeView={activeNavView}
        onViewChange={(view) => {
          setActiveNavView(view);
          if (view === 'board') handleReturnToBoard();
          if (view === 'decoded' && decodedSectionRef.current) {
            decodedSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        bookmarksCount={bookmarkedIds.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenPosterAutomation={() => setIsPosterAutomationOpen(true)}
      />

      <main className="flex-1 w-full">
        {/* Bookmarks / Saved View */}
        {activeNavView === 'bookmarks' ? (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-700">
              <div>
                <h1 className="font-serif text-3xl font-extrabold text-amber-100">
                  Your Saved Notices & Passes
                </h1>
                <p className="text-stone-400 text-xs mt-1">
                  Announcements and admission tickets you have bookmarked for this semester.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReturnToBoard}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer transition-colors"
              >
                Back to Cork Board
              </button>
            </div>

            {bookmarkedIds.length === 0 ? (
              <div className="text-center py-24 bg-stone-900/40 rounded-2xl border border-stone-800 text-stone-400">
                <Bookmark className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-sm">You haven't saved any notices yet.</p>
                <p className="text-xs text-stone-500 mt-1">Click the bookmark icon on any notice to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices
                  .filter((n) => bookmarkedIds.includes(n.id))
                  .map((notice) => (
                    <div key={notice.id} className="relative">
                      <NoticeCard
                        notice={notice}
                        isSelected={selectedNotice?.id === notice.id}
                        onSelect={(n) => {
                          setSelectedNotice(n);
                          setActiveNavView('decoded');
                          setTimeout(() => {
                            decodedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                          }, 50);
                        }}
                        breezeEnabled={breezeEnabled}
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Top Interactive Notice Board (Tactile Cork Board) */}
            <section ref={boardSectionRef} className="w-full pt-4 pb-8">
              <CorkBoard
                notices={notices}
                selectedNoticeId={selectedNotice?.id}
                onSelectNotice={handleSelectNotice}
                filterCategory={filterCategory}
                onFilterChange={setFilterCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                loupeEnabled={loupeEnabled}
                onToggleLoupe={() => setLoupeEnabled(!loupeEnabled)}
                breezeEnabled={breezeEnabled}
                onToggleBreeze={() => setBreezeEnabled(!breezeEnabled)}
                onOpenPosterAutomation={() => setIsPosterAutomationOpen(true)}
              />
            </section>

            {/* Decoded Detail Section (matching video at 00:06-00:14 & 00:19-00:25) */}
            <section ref={decodedSectionRef} className="w-full">
              {selectedNotice && (
                <DecodedDetailView
                  notice={selectedNotice}
                  onClose={handleReturnToBoard}
                  onOpenRegister={(n) => setRegisterModalNotice(n)}
                  onOpenPoster={(n) => setPosterModalNotice(n)}
                  isBookmarked={bookmarkedIds.includes(selectedNotice.id)}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}
            </section>

            {/* Bottom Chronological Timeline Ribbon */}
            <section className="w-full">
              <TimelineRibbon
                notices={notices}
                selectedId={selectedNotice?.id}
                onSelect={(n) => {
                  setSelectedNotice(n);
                  decodedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </section>
          </>
        )}
      </main>

      {/* Floating Bottom Left Action: Ask AI Notice Agent */}
      <div className="fixed bottom-6 left-6 z-30">
          <button
            type="button"
            onClick={() => setIsAgentDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm shadow-2xl hover:shadow-amber-500/30 border border-amber-300 cursor-pointer transition-all hover:scale-105 active:scale-95 group"
            title="Ask AI Notice Agent questions about deadlines, rules, and eligibility"
          >
            <Bot className="w-4 h-4 text-stone-900 group-hover:rotate-12 transition-transform" />
            <span>Ask AI Agent</span>
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping" />
          </button>
        </div>

      {/* Floating Return-To-Top Quick Action */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          type="button"
          onClick={handleReturnToBoard}
          className="p-3 rounded-full bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-stone-700 shadow-xl cursor-pointer transition-transform hover:scale-105"
          title="Scroll to Board"
          aria-label="Scroll to Board"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      {/* Modals & Floating Agent Drawer */}
      <AnimatePresence>
        {isAgentDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
            <AiNoticeAgent
              notices={notices}
              isFloating
              onSelectNotice={(notice) => {
                setSelectedNotice(notice);
                setIsAgentDrawerOpen(false);
                setActiveNavView('decoded');
                setTimeout(() => {
                  decodedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 80);
              }}
              onOpenRegister={(notice) => {
                setIsAgentDrawerOpen(false);
                setRegisterModalNotice(notice);
              }}
              onClose={() => setIsAgentDrawerOpen(false)}
            />
          </div>
        )}

        {registerModalNotice && (
          <RegisterModal
            notice={registerModalNotice}
            onClose={() => setRegisterModalNotice(null)}
            onSuccess={handleRegistrationSuccess}
          />
        )}

        {posterModalNotice && (
          <PosterModal
            notice={posterModalNotice}
            onClose={() => setPosterModalNotice(null)}
          />
        )}

        {isPinModalOpen && (
          <PinNoticeModal
            isOpen={isPinModalOpen}
            onClose={() => setIsPinModalOpen(false)}
            onNoticePinned={handleNoticePinned}
          />
        )}

        {isPosterAutomationOpen && (
          <PosterAutomationModal
            isOpen={isPosterAutomationOpen}
            onClose={() => setIsPosterAutomationOpen(false)}
            onNoticePublished={handleNoticePinned}
          />
        )}

        {isConflictModalOpen && (
          <ConflictRadarModal
            isOpen={isConflictModalOpen}
            onClose={() => setIsConflictModalOpen(false)}
            notices={notices}
            onSelectNotice={(n) => {
              setSelectedNotice(n);
              decodedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      {/* Verified Notice Published Toast */}
      {publishToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500/80 text-emerald-100 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold">{publishToast}</span>
        </div>
      )}
    </div>
  );
}
