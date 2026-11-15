import { useState, useEffect, useRef } from 'react';
import { X, Lock, Save, Trash2, RotateCcw, Download, Upload, Image as ImageIcon } from 'lucide-react';
import {
  type PortfolioDatabase,
  type TimelineItem,
  type StudyCourse,
  type WorkExperience,
  type BlogPost,
  type TimelinePhase,
  sortTimelineItems,
} from '../data/portfolioData';
import { useConfirm } from './ConfirmModal';
import { FormatToolbar } from './FormattedArticleContent';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: 'login' | 'manifest' | 'timeline' | 'course' | 'experience' | 'post' | 'backup';
  currentData: PortfolioDatabase;
  onSaveData: (newData: PortfolioDatabase) => void;
  onLoginSuccess: () => void;
  editingItem?: TimelineItem | StudyCourse | WorkExperience | BlogPost | null;
  onResetToDefaults: () => void;
}

export function AdminModal({
  isOpen,
  onClose,
  modalType,
  currentData,
  onSaveData,
  onLoginSuccess,
  editingItem,
  onResetToDefaults,
}: AdminModalProps) {
  const { requestConfirm } = useConfirm();
  const postTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  // Login State
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Preset images available in app
  const presetImages = [
    { label: 'Portrét (Káťa)', url: '/src/assets/images/portrait_kata_manifest_1793720229771.jpg' },
    { label: 'Otevřený sešit & výzkum', url: '/src/assets/images/blog_info_literacy_1793721968918.jpg' },
    { label: 'Digitální data & poznámky', url: '/src/assets/images/blog_digital_wellbeing_1793721966575.jpg' },
    { label: 'Knihy a čtení', url: '/src/assets/images/interest_books_reading_1793720231318.jpg' },
    { label: 'Analogová fotografie', url: '/src/assets/images/interest_analog_photo_1793720230936.jpg' },
    { label: 'Horský hřeben', url: '/src/assets/images/interest_mountain_hiking_1793720233561.jpg' },
    { label: 'Kreativní workshop', url: '/src/assets/images/interest_community_workshop_1793720232486.jpg' },
  ];

  // Forms state
  const [manifestForm, setManifestForm] = useState(currentData.manifest);
  const [timelineForm, setTimelineForm] = useState<Partial<TimelineItem>>({
    phase: 'present',
    phaseLabel: 'Kde jsem',
    timePeriod: '',
    title: '',
    subtitle: '',
    organization: '',
    location: '',
    description: '',
    personalReflection: '',
    keyHighlights: [],
    tags: [],
  });
  const [courseForm, setCourseForm] = useState<Partial<StudyCourse>>({
    code: '',
    title: '',
    semester: 'ZS',
    academicYear: '2024/2025',
    institution: 'Informační studia a knihovnictví',
    credits: 5,
    status: 'Absolvováno',
    comment: '',
    competencies: [],
    keyProject: '',
  });
  const [experienceForm, setExperienceForm] = useState<Partial<WorkExperience>>({
    role: '',
    organization: '',
    period: '',
    isCurrent: false,
    location: 'Brno',
    type: 'Částečný úvazek',
    summary: '',
    comment: '',
    achievements: [],
    skills: [],
  });
  const [postForm, setPostForm] = useState<Partial<BlogPost>>({
    title: '',
    topic: currentData.blogTopics[0] || 'Informační gramotnost',
    date: 'Listopad 2025',
    readTime: '5 min čtení',
    imageUrl: presetImages[1].url,
    annotation: '',
    featuredQuote: '',
    content: [],
    tags: [],
  });

  // String helpers for arrays
  const [highlightsInput, setHighlightsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [competenciesInput, setCompetenciesInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [achievementsInput, setAchievementsInput] = useState('');
  const [postContentInput, setPostContentInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');

  useEffect(() => {
    if (modalType === 'manifest') {
      setManifestForm(currentData.manifest);
    } else if (modalType === 'timeline') {
      if (editingItem) {
        const item = editingItem as TimelineItem;
        setTimelineForm(item);
        setHighlightsInput((item.keyHighlights || []).join('\n'));
        setTagsInput((item.tags || []).join(', '));
      } else {
        setTimelineForm({
          id: `tl-${Date.now()}`,
          phase: 'present',
          phaseLabel: 'Kde jsem',
          timePeriod: '2025',
          title: '',
          subtitle: '',
          organization: '',
          location: '',
          description: '',
          personalReflection: '',
          keyHighlights: [],
          tags: [],
        });
        setHighlightsInput('');
        setTagsInput('');
      }
    } else if (modalType === 'course') {
      if (editingItem) {
        const item = editingItem as StudyCourse;
        setCourseForm(item);
        setCompetenciesInput((item.competencies || []).join(', '));
      } else {
        setCourseForm({
          id: `c-${Date.now()}`,
          code: 'INF-',
          title: '',
          semester: 'ZS',
          academicYear: '2024/2025',
          institution: 'Informační studia a knihovnictví',
          credits: 5,
          status: 'Absolvováno',
          comment: '',
          competencies: [],
          keyProject: '',
        });
        setCompetenciesInput('');
      }
    } else if (modalType === 'experience') {
      if (editingItem) {
        const item = editingItem as WorkExperience;
        setExperienceForm(item);
        setAchievementsInput((item.achievements || []).join('\n'));
        setSkillsInput((item.skills || []).join(', '));
      } else {
        setExperienceForm({
          id: `exp-${Date.now()}`,
          role: '',
          organization: '',
          period: '2024 – dosud',
          isCurrent: true,
          location: 'Brno',
          type: 'Odborná praxe',
          summary: '',
          comment: '',
          achievements: [],
          skills: [],
        });
        setAchievementsInput('');
        setSkillsInput('');
      }
    } else if (modalType === 'post') {
      if (editingItem) {
        const item = editingItem as BlogPost;
        setPostForm(item);
        setPostContentInput((item.content || []).join('\n\n'));
        setTagsInput((item.tags || []).join(', '));
      } else {
        setPostForm({
          id: `post-${Date.now()}`,
          title: '',
          topic: currentData.blogTopics[0] || 'Informační gramotnost',
          date: 'Listopad 2025',
          readTime: '5 min čtení',
          imageUrl: presetImages[1].url,
          annotation: '',
          featuredQuote: '',
          content: [],
          tags: [],
        });
        setPostContentInput('');
        setTagsInput('');
      }
    } else if (modalType === 'backup') {
      setJsonInput(JSON.stringify(currentData, null, 2));
    }
  }, [modalType, editingItem, currentData, isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = ['kata2025', 'admin123', 'heslo123', 'admin', 'kata'].includes(password.trim().toLowerCase());
    if (valid) {
      setLoginError('');
      onLoginSuccess();
      onClose();
    } else {
      setLoginError('Nesprávné heslo. Zkuste heslo "kata2025" nebo "admin123".');
    }
  };

  // Image upload handler (converts to base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'manifest' | 'post') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'manifest') {
        setManifestForm((prev) => ({ ...prev, photoUrl: result }));
      } else if (target === 'post') {
        setPostForm((prev) => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Handlers
  const handleSaveManifest = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveData({
      ...currentData,
      manifest: manifestForm,
    });
    onClose();
  };

  const handleSaveTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    const highlights = highlightsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let phaseLabel = 'Kde jsem';
    if (timelineForm.phase === 'past') phaseLabel = 'Odkud jdu';
    if (timelineForm.phase === 'future') phaseLabel = 'Kam směřuji';

    const itemToSave: TimelineItem = {
      id: timelineForm.id || `tl-${Date.now()}`,
      phase: (timelineForm.phase as TimelinePhase) || 'present',
      phaseLabel: timelineForm.phaseLabel || phaseLabel,
      timePeriod: timelineForm.timePeriod || '2025',
      title: timelineForm.title || 'Nový milník',
      subtitle: timelineForm.subtitle || '',
      organization: timelineForm.organization || '',
      location: timelineForm.location || '',
      description: timelineForm.description || '',
      personalReflection: timelineForm.personalReflection || '',
      keyHighlights: highlights,
      tags: tags.length ? tags : ['Milník'],
    };

    let updatedList = [...currentData.timeline];
    const existingIndex = updatedList.findIndex((t) => t.id === itemToSave.id);
    if (existingIndex >= 0) {
      updatedList[existingIndex] = itemToSave;
    } else {
      updatedList.push(itemToSave);
    }

    onSaveData({ ...currentData, timeline: sortTimelineItems(updatedList) });
    onClose();
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const competencies = competenciesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const itemToSave: StudyCourse = {
      id: courseForm.id || `c-${Date.now()}`,
      code: courseForm.code || 'INF-000',
      title: courseForm.title || 'Nový předmět',
      semester: courseForm.semester || 'ZS',
      academicYear: courseForm.academicYear || '2024/2025',
      institution: courseForm.institution || 'Informační studia a knihovnictví',
      credits: Number(courseForm.credits) || 5,
      status: courseForm.status || 'Absolvováno',
      comment: courseForm.comment || '',
      competencies: competencies.length ? competencies : ['Informační gramotnost'],
      keyProject: courseForm.keyProject || '',
    };

    let updatedList = [...currentData.courses];
    const existingIndex = updatedList.findIndex((c) => c.id === itemToSave.id);
    if (existingIndex >= 0) {
      updatedList[existingIndex] = itemToSave;
    } else {
      updatedList.push(itemToSave);
    }

    onSaveData({ ...currentData, courses: updatedList });
    onClose();
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    const achievements = achievementsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const itemToSave: WorkExperience = {
      id: experienceForm.id || `exp-${Date.now()}`,
      role: experienceForm.role || 'Pracovní pozice',
      organization: experienceForm.organization || 'Organizace',
      period: experienceForm.period || '2024 – dosud',
      isCurrent: Boolean(experienceForm.isCurrent),
      location: experienceForm.location || 'Brno',
      type: experienceForm.type || 'Částečný úvazek',
      summary: experienceForm.summary || '',
      comment: experienceForm.comment || '',
      achievements,
      skills: skills.length ? skills : ['Práce s informacemi'],
    };

    let updatedList = [...currentData.experiences];
    const existingIndex = updatedList.findIndex((exp) => exp.id === itemToSave.id);
    if (existingIndex >= 0) {
      updatedList[existingIndex] = itemToSave;
    } else {
      updatedList.push(itemToSave);
    }

    onSaveData({ ...currentData, experiences: updatedList });
    onClose();
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const contentParagraphs = postContentInput
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);
    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const postToSave: BlogPost = {
      id: postForm.id || `post-${Date.now()}`,
      title: postForm.title || 'Nový článek',
      topic: postForm.topic || currentData.blogTopics[0] || 'Informační gramotnost',
      date: postForm.date || 'Listopad 2025',
      readTime: postForm.readTime || '5 min čtení',
      imageUrl: postForm.imageUrl || presetImages[1].url,
      annotation: postForm.annotation || '',
      featuredQuote: postForm.featuredQuote || '',
      content: contentParagraphs.length ? contentParagraphs : [postForm.annotation || 'Text článku...'],
      tags: tags.length ? tags : ['Článek'],
    };

    let updatedList = [...currentData.posts];
    const existingIndex = updatedList.findIndex((p) => p.id === postToSave.id);
    if (existingIndex >= 0) {
      updatedList[existingIndex] = postToSave;
    } else {
      updatedList.unshift(postToSave);
    }

    // Keep only topics that have at least one post
    const updatedTopics = Array.from(
      new Set([...currentData.blogTopics, postToSave.topic])
    ).filter((t) => updatedList.some((p) => p.topic === t));

    onSaveData({ ...currentData, posts: updatedList, blogTopics: updatedTopics });
    onClose();
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.manifest && parsed.timeline && parsed.courses && parsed.experiences && parsed.interests) {
        onSaveData(parsed);
        alert('Data byla úspěšně importována!');
        onClose();
      } else {
        alert('Neplatná struktura JSON dat.');
      }
    } catch (e) {
      alert('Chyba při parsování JSON: ' + String(e));
    }
  };

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'kata-portfolio-backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-stone-600" />
            <h3 className="text-xl font-bold text-stone-900">
              {modalType === 'login' && 'Přihlášení do správy portfolia'}
              {modalType === 'manifest' && 'Úprava osobního manifestu & profilu'}
              {modalType === 'timeline' && (editingItem ? 'Upravit milník na časové ose' : 'Přidat nový milník')}
              {modalType === 'course' && (editingItem ? 'Upravit absolvovaný předmět' : 'Přidat předmět')}
              {modalType === 'experience' && (editingItem ? 'Upravit pracovní zkušenost' : 'Přidat zkušenost')}
              {modalType === 'post' && (editingItem ? 'Upravit článek na blogu' : 'Přidat článek na blog')}
              {modalType === 'backup' && 'Záloha a obnovení dat'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
            aria-label="Zavřít"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. LOGIN MODAL */}
        {modalType === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <p className="text-sm text-stone-600">
              Zadejte heslo pro vstup do administračního režimu úprav. Zde můžete upravovat texty, přidávat a mazat položky na časové ose, ve studiu, zkušenostech i blogu.
            </p>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Heslo správce</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Zadejte heslo..."
                className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-stone-900 text-stone-900"
                autoFocus
              />
              <p className="text-xs text-stone-500 font-mono">
                Tip pro vyzkoušení: zadejte heslo <code className="bg-stone-100 px-1 py-0.5 rounded">kata2025</code> nebo <code className="bg-stone-100 px-1 py-0.5 rounded">admin123</code>
              </p>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-md border border-red-200">
                {loginError}
              </p>
            )}

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                Přihlásit se
              </button>
            </div>
          </form>
        )}

        {/* 2. MANIFEST & PROFILE MODAL */}
        {modalType === 'manifest' && (
          <form onSubmit={handleSaveManifest} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Celé jméno</label>
                <input
                  type="text"
                  value={manifestForm.authorName}
                  onChange={(e) => setManifestForm({ ...manifestForm, authorName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Lokalita</label>
                <input
                  type="text"
                  value={manifestForm.authorLocation}
                  onChange={(e) => setManifestForm({ ...manifestForm, authorLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Profesní zaměření / Titulek role</label>
              <input
                type="text"
                value={manifestForm.authorRole}
                onChange={(e) => setManifestForm({ ...manifestForm, authorRole: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Hlavní nadpis (Headline)</label>
              <textarea
                value={manifestForm.heroHeadline}
                onChange={(e) => setManifestForm({ ...manifestForm, heroHeadline: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Podnadpis (Úvodní myšlenka)</label>
              <textarea
                value={manifestForm.heroSubhead}
                onChange={(e) => setManifestForm({ ...manifestForm, heroSubhead: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Osobní citát manifestu</label>
              <textarea
                value={manifestForm.manifestQuote}
                onChange={(e) => setManifestForm({ ...manifestForm, manifestQuote: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            {/* Photo settings */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="block text-stone-700 font-semibold">Fotografie profilu</label>
              <div className="flex items-center gap-3">
                <img
                  src={manifestForm.photoUrl}
                  alt="Náhled"
                  className="w-12 h-12 rounded-full object-cover border border-stone-300"
                />
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={manifestForm.photoUrl}
                    onChange={(e) => setManifestForm({ ...manifestForm, photoUrl: e.target.value })}
                    placeholder="URL obrázku nebo zvolte níže..."
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  />
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setManifestForm({ ...manifestForm, photoUrl: '/assets/aistudio/profile_picture_c1a456ff.jpeg' })}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
                    >
                      Použít nový brand profilový obrázek
                    </button>
                    <label className="text-[11px] text-stone-600 hover:text-stone-900 font-medium cursor-pointer underline">
                      Nahrát vlastní foto ze souboru
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'manifest')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Uložit změny manifestu</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. TIMELINE ITEM MODAL */}
        {modalType === 'timeline' && (
          <form onSubmit={handleSaveTimeline} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Etapa časové osy</label>
                <select
                  value={timelineForm.phase}
                  onChange={(e) => {
                    const val = e.target.value as TimelinePhase;
                    let label = 'Kde jsem';
                    if (val === 'past') label = 'Odkud jdu';
                    if (val === 'future') label = 'Kam směřuji';
                    setTimelineForm({ ...timelineForm, phase: val, phaseLabel: label });
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-medium"
                >
                  <option value="past">Odkud jdu (Minulost)</option>
                  <option value="present">Kde jsem (Přítomnost)</option>
                  <option value="future">Kam směřuji (Budoucnost & Vize)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Časové období / Roky</label>
                <input
                  type="text"
                  value={timelineForm.timePeriod}
                  onChange={(e) => setTimelineForm({ ...timelineForm, timePeriod: e.target.value })}
                  placeholder="např. 2023 – současnost, 2026 – 2028"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Hlavní název milníku</label>
              <input
                type="text"
                value={timelineForm.title}
                onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })}
                placeholder="např. Výzkum informační gramotnosti pro éru AI"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Podtitul / Zaměření</label>
              <input
                type="text"
                value={timelineForm.subtitle}
                onChange={(e) => setTimelineForm({ ...timelineForm, subtitle: e.target.value })}
                placeholder="např. Propojování kognitivních principů s rešeršní praxí"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Instituce / Organizace</label>
                <input
                  type="text"
                  value={timelineForm.organization}
                  onChange={(e) => setTimelineForm({ ...timelineForm, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Místo / Město</label>
                <input
                  type="text"
                  value={timelineForm.location}
                  onChange={(e) => setTimelineForm({ ...timelineForm, location: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Popis etapy a činností</label>
              <textarea
                value={timelineForm.description}
                onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })}
                rows={3}
                placeholder="Popište, co tato etapa obnášela nebo obnáší..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Osobní reflexe / Co mi to dalo a kam to vede</label>
              <textarea
                value={timelineForm.personalReflection}
                onChange={(e) => setTimelineForm({ ...timelineForm, personalReflection: e.target.value })}
                rows={2}
                placeholder="Osobní zamyšlení a poučení..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Klíčové výsledky a milníky (jeden na řádek)</label>
              <textarea
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                rows={3}
                placeholder="Vedení workshopů pro 500+ studentů&#10;Publikace didaktických materiálů&#10;Ocenění děkana"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Štítky (oddělené čárkou)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Informační gramotnost, Vize, AI, Didaktika"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Uložit milník</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. STUDY COURSE MODAL */}
        {modalType === 'course' && (
          <form onSubmit={handleSaveCourse} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Kód předmětu</label>
                <input
                  type="text"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                  placeholder="např. INF-101"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Semestr</label>
                <select
                  value={courseForm.semester}
                  onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                >
                  <option value="ZS">ZS (Zimní semestr)</option>
                  <option value="LS">LS (Letní semestr)</option>
                </select>
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Akademický rok</label>
                <input
                  type="text"
                  value={courseForm.academicYear}
                  onChange={(e) => setCourseForm({ ...courseForm, academicYear: e.target.value })}
                  placeholder="2024/2025"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Název předmětu</label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="např. Informační architektura a vyhledávání"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Status / Hodnocení</label>
              <input
                type="text"
                value={courseForm.status}
                onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                placeholder="Absolvováno s vyznamenáním"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Osobní komentář k předmětu</label>
              <textarea
                value={courseForm.comment}
                onChange={(e) => setCourseForm({ ...courseForm, comment: e.target.value })}
                rows={3}
                placeholder="Co mi předmět dal, jak mě posunul a proč byl přínosný..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Klíčový semestrální projekt (volitelné)</label>
              <input
                type="text"
                value={courseForm.keyProject}
                onChange={(e) => setCourseForm({ ...courseForm, keyProject: e.target.value })}
                placeholder="např. Redesign fakultního repozitáře"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Získané kompetence (oddělené čárkou)</label>
              <input
                type="text"
                value={competenciesInput}
                onChange={(e) => setCompetenciesInput(e.target.value)}
                placeholder="Didaktika, Systematické rešerše, Card sorting, WCAG"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Uložit předmět</span>
              </button>
            </div>
          </form>
        )}

        {/* 5. WORK EXPERIENCE MODAL */}
        {modalType === 'experience' && (
          <form onSubmit={handleSaveExperience} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Název pozice</label>
                <input
                  type="text"
                  value={experienceForm.role}
                  onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                  placeholder="např. Lektorka informačního vzdělávání"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Organizace / Zaměstnavatel</label>
                <input
                  type="text"
                  value={experienceForm.organization}
                  onChange={(e) => setExperienceForm({ ...experienceForm, organization: e.target.value })}
                  placeholder="např. Vědecká knihovna v Brně"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Časové období</label>
                <input
                  type="text"
                  value={experienceForm.period}
                  onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                  placeholder="09/2024 – dosud"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Místo</label>
                <input
                  type="text"
                  value={experienceForm.location}
                  onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                  placeholder="Brno / Hybridně"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Typ úvazku</label>
                <input
                  type="text"
                  value={experienceForm.type}
                  onChange={(e) => setExperienceForm({ ...experienceForm, type: e.target.value })}
                  placeholder="Částečný úvazek"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrentExp"
                checked={experienceForm.isCurrent}
                onChange={(e) => setExperienceForm({ ...experienceForm, isCurrent: e.target.checked })}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <label htmlFor="isCurrentExp" className="text-xs font-medium text-stone-700 cursor-pointer">
                Stále na této pozici aktivně působím
              </label>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Stručný popis pracovní náplně</label>
              <textarea
                value={experienceForm.summary}
                onChange={(e) => setExperienceForm({ ...experienceForm, summary: e.target.value })}
                rows={2}
                placeholder="Hlavní zodpovědnosti a činnosti..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Osobní komentář k pozici</label>
              <textarea
                value={experienceForm.comment}
                onChange={(e) => setExperienceForm({ ...experienceForm, comment: e.target.value })}
                rows={3}
                placeholder="Co vám tato práce přinesla a jaké zážitky vás formovaly..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Konkrétní výsledky a úspěchy (jeden na řádek)</label>
              <textarea
                value={achievementsInput}
                onChange={(e) => setAchievementsInput(e.target.value)}
                rows={3}
                placeholder="Úspěšně vyškoleno 600+ studentů&#10;Zkrácení doby rešerší o 30%"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Klíčové dovednosti (oddělené čárkou)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Didaktický design, Rešerše, Facilitace, Analýza dat"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Uložit zkušenost</span>
              </button>
            </div>
          </form>
        )}

        {/* 6. BLOG POST MODAL */}
        {modalType === 'post' && (
          <form onSubmit={handleSavePost} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Téma / Kategorie článku</label>
                <select
                  value={postForm.topic}
                  onChange={(e) => setPostForm({ ...postForm, topic: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-medium"
                >
                  {currentData.blogTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Datum publikace & odhad čtení</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={postForm.date}
                    onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                    placeholder="např. 15. listopadu 2025"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                    required
                  />
                  <input
                    type="text"
                    value={postForm.readTime}
                    onChange={(e) => setPostForm({ ...postForm, readTime: e.target.value })}
                    placeholder="5 min čtení"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Titulek článku</label>
              <input
                type="text"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                placeholder="např. Jak naučit studenty číst data bez manipulace"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-semibold"
                required
              />
            </div>

            {/* Photo selector */}
            <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <label className="block text-stone-700 font-semibold">Fotografie článku</label>
              <div className="flex items-center gap-3">
                <img
                  src={postForm.imageUrl}
                  alt="Náhled"
                  className="w-16 h-12 object-cover rounded-md border border-stone-300"
                />
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={postForm.imageUrl}
                    onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                    placeholder="URL obrázku..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-md text-stone-900"
                  />
                  <label className="text-[11px] text-stone-600 hover:text-stone-900 font-medium cursor-pointer underline block">
                    Nahrát fotku ze zařízení
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'post')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-1 flex flex-wrap gap-1.5">
                {presetImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPostForm({ ...postForm, imageUrl: img.url })}
                    className={`px-2 py-0.5 text-[11px] rounded border transition-colors cursor-pointer ${
                      postForm.imageUrl === img.url
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Anotace článku (shrnutí pro náhled)</label>
              <textarea
                value={postForm.annotation}
                onChange={(e) => setPostForm({ ...postForm, annotation: e.target.value })}
                rows={2}
                placeholder="Stručný úvod a kontext článku..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Vybraná citace (Featured Quote)</label>
              <textarea
                value={postForm.featuredQuote}
                onChange={(e) => setPostForm({ ...postForm, featuredQuote: e.target.value })}
                rows={2}
                placeholder="Silná myšlenka z článku zvýrazněná na kartě..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 italic"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Celý obsah článku (jednotlivé odstavce oddělujte prázdným řádkem)</label>
              <FormatToolbar
                textareaRef={postTextareaRef}
                value={postContentInput}
                onChange={setPostContentInput}
              />
              <textarea
                ref={postTextareaRef}
                value={postContentInput}
                onChange={(e) => setPostContentInput(e.target.value)}
                rows={6}
                placeholder="Sem vložte text článku. Mezi odstavci nechejte prázdný řádek..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Štítky (oddělené čárkou)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Informační gramotnost, Školství, Didaktika"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Uložit článek</span>
              </button>
            </div>
          </form>
        )}

        {/* 8. BACKUP / RESTORE MODAL */}
        {modalType === 'backup' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <p className="text-stone-600">
              Veškeré vámi provedené změny se ukládají do paměti prohlížeče (localStorage). Zde můžete svá data zazálohovat jako JSON soubor, importovat jinou zálohu, nebo obnovit původní vzorová data.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleDownloadBackup}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Stáhnout zálohu (JSON)</span>
              </button>

              <button
                onClick={() => {
                  requestConfirm({
                    title: 'Obnovit výchozí data',
                    message: 'Opravdu chcete obnovit všechna data na původní vzorový stav? Vaše vlastní úpravy budou přepsány.',
                    confirmLabel: 'Obnovit data',
                    onConfirm: () => {
                      onResetToDefaults();
                      onClose();
                    },
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer border border-stone-300"
              >
                <RotateCcw className="w-4 h-4 text-stone-500" />
                <span>Obnovit výchozí vzorová data</span>
              </button>
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <label className="block text-stone-700 font-semibold">
                Importovat data ze zálohy (JSON kód):
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono text-xs"
              />
              <button
                onClick={handleImportJson}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-medium hover:bg-stone-700 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Nahrát a aplikovat JSON</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
