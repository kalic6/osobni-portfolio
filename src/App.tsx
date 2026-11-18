import { useState, useEffect } from 'react';
import {
  getStoredPortfolioData,
  saveStoredPortfolioData,
  resetStoredPortfolioData,
  getAdminSession,
  setAdminSession,
  defaultSiteTexts,
  sortTimelineItems,
  PHASE_LABELS,
  type TimelinePhase,
  type PortfolioDatabase,
  type ManifestData,
  type TimelineItem,
  type StudyCourse,
  type WorkExperience,
  type BlogPost,
  type SitePalette,
  SITE_PALETTES,
  getSiteText,
  isEditorEnvironment,
  hasLocalStorageEdits,
  syncPortfolioToCodebase,
} from './data/portfolioData';

import { Header, type PageView } from './components/Header';
import { HeroManifest } from './components/HeroManifest';
import { InteractiveTimeline } from './components/InteractiveTimeline';
import { StudySection } from './components/StudySection';
import { ExperienceSection } from './components/ExperienceSection';
import { BlogSection } from './components/BlogSection';
import { ArticleDetailView } from './components/ArticleDetailView';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { ConfirmProvider, useConfirm } from './components/ConfirmModal';
import { Check, Edit, LogOut, Database, Sparkles, Palette, Save, Loader2 } from 'lucide-react';

function PortfolioApp() {
  const { requestConfirm } = useConfirm();

  // Primary data state stored in localStorage
  const [data, setData] = useState<PortfolioDatabase>(() => getStoredPortfolioData());

  // Current view navigation: 'home' | 'timeline' | 'study' | 'experience' | 'blog' | 'article'
  const [activeView, setActiveView] = useState<PageView>('home');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const canManagePortfolio = isEditorEnvironment();

  // Admin authentication state (restricted strictly to editor environment)
  const [isAdminState, setIsAdminState] = useState<boolean>(() =>
    canManagePortfolio ? getAdminSession() : false
  );
  const isAdmin = canManagePortfolio && isAdminState;

  // Modal manager state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'login' | 'manifest' | 'timeline' | 'course' | 'experience' | 'post' | 'backup'
  >('login');
  const [editingItem, setEditingItem] = useState<
    TimelineItem | StudyCourse | WorkExperience | BlogPost | null
  >(null);

  // Notification toast & GitHub codebase sync status
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Helper to show transient notification
  const showToast = (msg: string, durationMs = 4000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, durationMs);
  };

  // Automatically persist existing localStorage edits into src/data/publishedData.json in editor mode
  useEffect(() => {
    if (canManagePortfolio && hasLocalStorageEdits()) {
      void syncPortfolioToCodebase(data);
    }
  }, [canManagePortfolio]);

  const handleSyncToCodebase = async () => {
    if (syncStatus === 'saving') return;
    setSyncStatus('saving');
    const ok = await syncPortfolioToCodebase(data);
    if (ok) {
      setSyncStatus('saved');
      showToast(
        'Uloženo v editoru! Aby se textové úpravy přenesly i do GitHub Syncu, napište do chatu např. „Propiš úpravy pro GitHub“ a pak odešlete Sync.',
        8000
      );
      setTimeout(() => {
        setSyncStatus((prev) => (prev === 'saved' ? 'idle' : prev));
      }, 6000);
    } else {
      setSyncStatus('error');
      showToast(
        'Uložení do kódu se nezdařilo. Zkuste prosím obnovit stránku editoru.',
        5000
      );
      setTimeout(() => {
        setSyncStatus((prev) => (prev === 'error' ? 'idle' : prev));
      }, 4000);
    }
  };

  // Synchronize state changes to localStorage
  const handleSaveData = (newData: PortfolioDatabase, feedbackMsg?: string) => {
    // Automatically prune blog topics that have 0 posts
    const prunedTopics = newData.blogTopics.filter((t) => newData.posts.some((p) => p.topic === t));
    const cleanData = { ...newData, blogTopics: prunedTopics };
    setData(cleanData);
    saveStoredPortfolioData(cleanData);
    if (feedbackMsg) {
      showToast(feedbackMsg);
    }
  };

  // Reset all data back to initial defaults
  const handleResetToDefaults = () => {
    const fresh = resetStoredPortfolioData();
    setData(fresh);
    showToast('Portfolio bylo obnoveno do výchozího vzorového stavu.');
  };

  // Admin login handler
  const handleLoginSuccess = () => {
    if (!canManagePortfolio) return;
    setIsAdminState(true);
    setAdminSession(true);
    showToast('Jste přihlášena jako administrátorka portfolia. Režim úprav je aktivní.');
  };

  // Admin logout handler
  const handleLogout = () => {
    setIsAdminState(false);
    setAdminSession(false);
    showToast('Byla jste bezpečně odhlášena z režimu úprav.');
  };

  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  const scrollToSectionAnchor = (anchor: string) => {
    const id = anchor.replace(/^#/, '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (activeView === 'home' && pendingAnchor) {
      const target = pendingAnchor;
      setPendingAnchor(null);
      requestAnimationFrame(() => {
        setTimeout(() => scrollToSectionAnchor(target), 60);
      });
    }
  }, [activeView, pendingAnchor]);

  // Safe navigation handler (supports optional section anchor like #timeline)
  const handleNavigate = (view: PageView, sectionAnchor?: string) => {
    if (view !== 'article') {
      setActivePostId(null);
    }
    if (view === 'home' && sectionAnchor && sectionAnchor !== '#uvod') {
      if (activeView === 'home') {
        scrollToSectionAnchor(sectionAnchor);
      } else {
        setPendingAnchor(sectionAnchor);
        setActiveView('home');
      }
      return;
    }
    setPendingAnchor(null);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open standalone article view
  const handleOpenArticle = (postId: string) => {
    setActivePostId(postId);
    setActiveView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manifest update handler
  const handleUpdateManifest = (updatedManifest: Partial<ManifestData>) => {
    const updated = {
      ...data,
      manifest: {
        ...data.manifest,
        ...updatedManifest,
      },
    };
    handleSaveData(updated, 'Osobní manifest byl úspěšně aktualizován.');
  };

  // Milestone reordering handler
  const handleMoveTimelineItem = (id: string, direction: 'up' | 'down') => {
    const sorted = sortTimelineItems(data.timeline);
    const index = sorted.findIndex((i) => i.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    // Swap items in order
    const updated = [...sorted];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // If moving across phases, update phase to match neighborhood
    const neighbor = updated[targetIndex === 0 ? 1 : targetIndex - 1];
    if (neighbor && moved.phase !== neighbor.phase) {
      moved.phase = neighbor.phase;
    }

    handleSaveData({ ...data, timeline: updated }, 'Pořadí milníků bylo upraveno.');
  };

  // Insert milestone at specific index or phase
  const handleInsertTimelineItemAt = (insertIndex: number, phase: TimelinePhase) => {
    const newId = `tl-${Date.now()}`;
    const newItem: TimelineItem = {
      id: newId,
      phase,
      phaseLabel: PHASE_LABELS[phase],
      timePeriod: new Date().getFullYear().toString(),
      title: 'Nový milník na časové ose',
      subtitle: 'Klikněte pro úpravu podrobností',
      organization: 'Organizace / Instituce',
      location: 'Město',
      description: 'Stručný popis tohoto milníku, osobní reflexe a dosažené výsledky.',
      personalReflection: 'Osobní reflexe a co mi tato etapa dala.',
      keyHighlights: ['Klíčová dovednost či výsledek'],
      tags: ['Téma'],
    };

    const sorted = sortTimelineItems(data.timeline);
    const updated = [...sorted];
    updated.splice(insertIndex, 0, newItem);
    handleSaveData({ ...data, timeline: updated }, 'Nový milník byl vložen na časovou osu.');
    setEditingItem(newItem);
    setModalType('timeline');
    setModalOpen(true);
  };

  // Reordering handlers for Courses, Experiences, and Interests
  const handleMoveCourse = (id: string, direction: 'up' | 'down') => {
    const index = data.courses.findIndex((c) => c.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.courses.length) return;
    const updated = [...data.courses];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    handleSaveData({ ...data, courses: updated }, 'Pořadí předmětů bylo upraveno.');
  };

  const handleMoveExperience = (id: string, direction: 'up' | 'down') => {
    const index = data.experiences.findIndex((e) => e.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.experiences.length) return;
    const updated = [...data.experiences];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    handleSaveData({ ...data, experiences: updated }, 'Pořadí zkušeností bylo upraveno.');
  };

  // Single field / direct edit handlers
  const handleUpdateTimelineItem = (id: string, updated: Partial<TimelineItem>) => {
    const updatedList = data.timeline.map((item) =>
      item.id === id ? { ...item, ...updated } : item
    );
    handleSaveData({ ...data, timeline: updatedList }, 'Milník byl upraven.');
  };

  const handleUpdateCourse = (id: string, updated: Partial<StudyCourse>) => {
    const updatedList = data.courses.map((item) =>
      item.id === id ? { ...item, ...updated } : item
    );
    handleSaveData({ ...data, courses: updatedList }, 'Předmět byl upraven.');
  };

  const handleUpdateExperience = (id: string, updated: Partial<WorkExperience>) => {
    const updatedList = data.experiences.map((item) =>
      item.id === id ? { ...item, ...updated } : item
    );
    handleSaveData({ ...data, experiences: updatedList }, 'Pracovní zkušenost byla upravena.');
  };

  const handleUpdatePost = (id: string, updated: Partial<BlogPost>) => {
    const updatedList = data.posts.map((item) =>
      item.id === id ? { ...item, ...updated } : item
    );
    const candidateTopics = Array.from(new Set([...data.blogTopics, ...(updated.topic ? [updated.topic] : [])]));
    const prunedTopics = candidateTopics.filter((t) => updatedList.some((p) => p.topic === t));
    handleSaveData({ ...data, posts: updatedList, blogTopics: prunedTopics }, 'Článek blogu byl upraven.');
  };

  const handleUpdateSiteText = (key: string, value: string) => {
    const updatedTexts = { ...(data.siteTexts || defaultSiteTexts), [key]: value };
    handleSaveData({ ...data, siteTexts: updatedTexts }, 'Text byl upraven.');
  };

  // Safe Deletion handlers with custom in-page modal dialog
  const handleDeleteTimelineItem = (id: string) => {
    const item = data.timeline.find((t) => t.id === id);
    requestConfirm({
      title: 'Smazat milník',
      message: `Opravdu chcete smazat milník "${item?.title || 'tento milník'}" z časové osy? Tuto akci nelze vrátit zpět.`,
      confirmLabel: 'Smazat milník',
      onConfirm: () => {
        const updated = data.timeline.filter((item) => item.id !== id);
        handleSaveData({ ...data, timeline: updated }, 'Milník byl smazán.');
      },
    });
  };

  const handleDeleteCourse = (id: string) => {
    const item = data.courses.find((c) => c.id === id);
    requestConfirm({
      title: 'Smazat předmět',
      message: `Opravdu chcete smazat předmět "${item?.title || 'tento předmět'}"? Tuto akci nelze vrátit zpět.`,
      confirmLabel: 'Smazat předmět',
      onConfirm: () => {
        const updated = data.courses.filter((item) => item.id !== id);
        handleSaveData({ ...data, courses: updated }, 'Předmět byl smazán.');
      },
    });
  };

  const handleDeleteExperience = (id: string) => {
    const item = data.experiences.find((e) => e.id === id);
    requestConfirm({
      title: 'Smazat pracovní zkušenost',
      message: `Opravdu chcete smazat pracovní zkušenost "${item?.role || 'tuto zkušenost'}"? Tuto akci nelze vrátit zpět.`,
      confirmLabel: 'Smazat zkušenost',
      onConfirm: () => {
        const updated = data.experiences.filter((item) => item.id !== id);
        handleSaveData({ ...data, experiences: updated }, 'Pracovní zkušenost byla smazána.');
      },
    });
  };

  const handleDeletePost = (id: string) => {
    const item = data.posts.find((p) => p.id === id);
    requestConfirm({
      title: 'Smazat článek',
      message: `Opravdu chcete smazat článek "${item?.title || 'tento článek'}"? Tuto akci nelze vrátit zpět.`,
      confirmLabel: 'Smazat článek',
      onConfirm: () => {
        const updated = data.posts.filter((item) => item.id !== id);
        const prunedTopics = data.blogTopics.filter((t) => updated.some((p) => p.topic === t));
        handleSaveData({ ...data, posts: updated, blogTopics: prunedTopics }, 'Článek byl smazán.');
      },
    });
  };

  const handleAddTopic = (newTopic: string) => {
    if (!data.blogTopics.includes(newTopic)) {
      const updatedTopics = [...data.blogTopics, newTopic];
      handleSaveData({ ...data, blogTopics: updatedTopics }, `Téma "${newTopic}" bylo přidáno.`);
    }
  };

  // Modal open helpers (available only in editor environment)
  const openLogin = () => {
    if (!canManagePortfolio) return;
    setModalType('login');
    setEditingItem(null);
    setModalOpen(true);
  };

  const openManifestEdit = () => {
    if (!canManagePortfolio) return;
    setModalType('manifest');
    setEditingItem(null);
    setModalOpen(true);
  };

  const openAddModal = (
    type: 'timeline' | 'course' | 'experience' | 'post'
  ) => {
    if (!canManagePortfolio) return;
    setModalType(type);
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditTimeline = (item: TimelineItem) => {
    if (!canManagePortfolio) return;
    setEditingItem(item);
    setModalType('timeline');
    setModalOpen(true);
  };

  const openEditCourse = (course: StudyCourse) => {
    if (!canManagePortfolio) return;
    setEditingItem(course);
    setModalType('course');
    setModalOpen(true);
  };

  const openEditExperience = (exp: WorkExperience) => {
    if (!canManagePortfolio) return;
    setEditingItem(exp);
    setModalType('experience');
    setModalOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    if (!canManagePortfolio) return;
    setEditingItem(post);
    setModalType('post');
    setModalOpen(true);
  };

  const openBackup = () => {
    if (!canManagePortfolio) return;
    setModalType('backup');
    setEditingItem(null);
    setModalOpen(true);
  };

  // Resolve active color palette
  const activePaletteId = getSiteText(
    data.siteTexts,
    'site.colorPalette',
    getSiteText(data.siteTexts, 'aiPrinciples.colorPalette', 'editorial-paper')
  );
  const activePalette: SitePalette =
    SITE_PALETTES.find((p) => p.id === activePaletteId) || SITE_PALETTES[0];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${activePalette.appWrapper} selection:bg-stone-900 selection:text-white`}>
      {/* Sticky Top Bar Header with activeView navigation */}
      <Header
        isAdmin={isAdmin}
        canManagePortfolio={canManagePortfolio}
        activeView={activeView}
        siteTexts={data.siteTexts || defaultSiteTexts}
        activePalette={activePalette}
        onUpdateSiteText={handleUpdateSiteText}
        onNavigate={handleNavigate}
        onOpenLogin={openLogin}
        onLogout={handleLogout}
        onOpenAddModal={openAddModal}
      />

      {/* Interactive Color Palette Switcher (Available in Admin Mode) */}
      {isAdmin && (
        <div className="bg-white/95 dark:bg-stone-900/95 border-b border-stone-200/90 dark:border-stone-800 shadow-2xs py-2 px-4 text-xs transition-colors z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center shadow-2xs shrink-0">
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-900 dark:text-white text-xs">
                    Barevná paleta stránek (aktivní styl):
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/90 border border-emerald-300/80 px-2 py-0.5 rounded-full">
                    {activePalette.name}
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 hidden md:inline">
                  {activePalette.tagline}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {SITE_PALETTES.map((pal) => {
                const isSelected = activePalette.id === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => handleUpdateSiteText('site.colorPalette', pal.id)}
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs ring-2 ring-stone-900 ring-offset-1'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                    }`}
                    title={pal.tagline}
                  >
                    <span className="flex items-center -space-x-1 shrink-0" aria-hidden="true">
                      {pal.swatches.map((color, i) => (
                        <span
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </span>
                    <span>{pal.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Prominent Admin WYSIWYG Banner */}
      {isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200/90 text-amber-950 px-4 py-2.5 text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shrink-0">
                ✓
              </span>
              <span className="font-semibold">Režim plné editace je aktivní:</span>
              <span className="text-amber-900">
                Kliknutím na jakýkoliv text, fotografii, pilíř či milník jej můžete ihned upravit nebo smazat. Šipkami nahoru/dolů lze měnit pořadí.
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleSyncToCodebase}
                disabled={syncStatus === 'saving'}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                  syncStatus === 'saved'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                    : syncStatus === 'error'
                      ? 'bg-rose-700 hover:bg-rose-800 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-70'
                }`}
                title="Zapíše aktuální podobu portfolia do souborů projektu, aby se projevila i na GitHubu"
              >
                {syncStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Ukládám pro GitHub...</span>
                  </>
                ) : syncStatus === 'saved' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Uloženo pro GitHub!</span>
                  </>
                ) : syncStatus === 'error' ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Chyba uložení – zkusit znovu</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Uložit úpravy pro GitHub</span>
                  </>
                )}
              </button>
              <button
                onClick={openBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-100 text-amber-950 rounded-lg text-xs font-semibold border border-amber-300 transition-colors shadow-2xs cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Záloha & Obnova dat</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ukončit režim úprav</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'home' && (
          /* HLAVNÍ STRÁNKA (HOMEPAGE) */
          <>
            <HeroManifest
              manifest={data.manifest}
              siteTexts={data.siteTexts || defaultSiteTexts}
              onUpdateSiteText={handleUpdateSiteText}
              isAdmin={isAdmin}
              onEditManifest={openManifestEdit}
              onUpdateManifest={handleUpdateManifest}
            />

            <InteractiveTimeline
              items={data.timeline}
              siteTexts={data.siteTexts || defaultSiteTexts}
              onUpdateSiteText={handleUpdateSiteText}
              isAdmin={isAdmin}
              onAddItem={() => openAddModal('timeline')}
              onEditItem={openEditTimeline}
              onDeleteItem={handleDeleteTimelineItem}
              onUpdateItem={handleUpdateTimelineItem}
              onMoveItem={handleMoveTimelineItem}
              onInsertItemAt={handleInsertTimelineItemAt}
            />

            <BlogSection
              posts={data.posts}
              topics={data.blogTopics}
              siteTexts={data.siteTexts || defaultSiteTexts}
              onUpdateSiteText={handleUpdateSiteText}
              isAdmin={isAdmin}
              isStandaloneView={false}
              onToggleStandaloneView={(open) => handleNavigate(open ? 'blog' : 'home')}
              onOpenPost={handleOpenArticle}
              onAddPost={() => openAddModal('post')}
              onEditPost={openEditPost}
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
              onAddTopic={handleAddTopic}
            />
          </>
        )}

        {activeView === 'study' && (
          /* SAMOSTATNÁ STRÁNKA: STUDIUM */
          <StudySection
            courses={data.courses}
            siteTexts={data.siteTexts || defaultSiteTexts}
            onUpdateSiteText={handleUpdateSiteText}
            isAdmin={isAdmin}
            onAddCourse={() => openAddModal('course')}
            onEditCourse={openEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onMoveCourse={handleMoveCourse}
            onUpdateCourse={handleUpdateCourse}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {activeView === 'experience' && (
          /* SAMOSTATNÁ STRÁNKA: PRACOVNÍ ZKUŠENOSTI */
          <ExperienceSection
            experiences={data.experiences}
            siteTexts={data.siteTexts || defaultSiteTexts}
            onUpdateSiteText={handleUpdateSiteText}
            isAdmin={isAdmin}
            onAddExperience={() => openAddModal('experience')}
            onEditExperience={openEditExperience}
            onDeleteExperience={handleDeleteExperience}
            onMoveExperience={handleMoveExperience}
            onUpdateExperience={handleUpdateExperience}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {activeView === 'blog' && (
          /* SAMOSTATNÁ STRÁNKA: CELÝ BLOG S TÉMATICKÝMI FILTRY */
          <BlogSection
            posts={data.posts}
            topics={data.blogTopics}
            siteTexts={data.siteTexts || defaultSiteTexts}
            onUpdateSiteText={handleUpdateSiteText}
            isAdmin={isAdmin}
            isStandaloneView={true}
            onToggleStandaloneView={(open) => handleNavigate(open ? 'blog' : 'home')}
            onOpenPost={handleOpenArticle}
            onAddPost={() => openAddModal('post')}
            onEditPost={openEditPost}
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
            onAddTopic={handleAddTopic}
          />
        )}

        {activeView === 'article' && (() => {
          const currentPost = data.posts.find((p) => p.id === activePostId) || data.posts[0];
          if (!currentPost) return null;
          return (
            <ArticleDetailView
              post={currentPost}
              allPosts={data.posts}
              author={{
                name: data.manifest.authorName,
                role: data.manifest.authorRole,
                email: data.manifest.authorEmail,
                location: data.manifest.authorLocation,
                photoUrl: data.manifest.photoUrl,
              }}
              siteTexts={data.siteTexts || defaultSiteTexts}
              onUpdateSiteText={handleUpdateSiteText}
              isAdmin={isAdmin}
              onBackToBlog={() => handleNavigate('blog')}
              onBackToHome={() => handleNavigate('home')}
              onOpenPost={handleOpenArticle}
              onEditPost={openEditPost}
              onDeletePost={(id) => {
                handleDeletePost(id);
                handleNavigate('blog');
              }}
              onUpdatePost={handleUpdatePost}
            />
          );
        })()}
      </main>

      {/* Footer */}
      <Footer
        authorName={data.manifest.authorName}
        authorRole={data.manifest.authorRole}
        authorEmail={data.manifest.authorEmail}
        authorLocation={data.manifest.authorLocation}
        siteTexts={data.siteTexts || defaultSiteTexts}
        onUpdateSiteText={handleUpdateSiteText}
        onOpenBackup={openBackup}
        onOpenLogin={openLogin}
        isAdmin={isAdmin}
        canManagePortfolio={canManagePortfolio}
        onNavigate={handleNavigate}
      />

      {/* Admin Modal (Editor Environment Only) */}
      {canManagePortfolio && (
        <AdminModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          modalType={modalType}
          currentData={data}
          onSaveData={handleSaveData}
          onLoginSuccess={handleLoginSuccess}
          editingItem={editingItem}
          onResetToDefaults={handleResetToDefaults}
        />
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-stone-800 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ConfirmProvider>
      <PortfolioApp />
    </ConfirmProvider>
  );
}
