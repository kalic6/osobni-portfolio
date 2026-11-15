export interface ManifestPoint {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface AiPrinciple {
  id: string;
  title: string;
  description: string;
  category?: string;
  iconName?: string;
}

export interface ManifestData {
  authorName: string;
  authorRole: string;
  authorEmail: string;
  authorLocation: string;
  photoUrl: string;
  photoAlt: string;
  heroHeadline: string;
  heroSubhead: string;
  manifestQuote: string;
  manifestQuoteAuthor: string;
  manifestPillars: ManifestPoint[];
  aiPrinciples?: AiPrinciple[];
  fullManifestText: string[];
}

export type TimelinePhase = 'past' | 'present' | 'future';

export const PHASE_ORDER: Record<TimelinePhase, number> = {
  past: 0,
  present: 1,
  future: 2,
};

export const PHASE_LABELS: Record<TimelinePhase, string> = {
  past: 'Odkud jdu',
  present: 'Kde jsem',
  future: 'Kam směřuji',
};

export function sortTimelineItems(items: TimelineItem[]): TimelineItem[] {
  if (!items || !items.length) return [];
  const past = items.filter((i) => i.phase === 'past');
  const present = items.filter((i) => i.phase === 'present');
  const future = items.filter((i) => i.phase === 'future');
  return [...past, ...present, ...future];
}

export function getSiteText(
  siteTexts: Record<string, string> | undefined,
  key: string,
  fallback: string
): string {
  if (siteTexts && typeof siteTexts[key] === 'string') {
    return siteTexts[key];
  }
  return fallback;
}

export interface TimelineItem {
  id: string;
  phase: TimelinePhase;
  phaseLabel: string;
  timePeriod: string;
  title: string;
  subtitle: string;
  organization?: string;
  location?: string;
  description: string;
  personalReflection: string;
  keyHighlights: string[];
  tags: string[];
}

export interface StudyCourse {
  id: string;
  code: string;
  title: string;
  semester: string;
  academicYear: string;
  institution: string;
  credits: number;
  status: string;
  comment: string;
  competencies: string[];
  keyProject?: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  isCurrent: boolean;
  location: string;
  type: string;
  summary: string;
  comment: string;
  achievements: string[];
  skills: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  topic: string;
  date: string;
  readTime: string;
  imageUrl: string;
  annotation: string;
  featuredQuote: string;
  content: string[];
  tags: string[];
}

export interface InterestItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  activityFrequency: string;
  personalNote: string;
  featuredOnHome: boolean;
  tags: string[];
}

export interface PortfolioDatabase {
  manifest: ManifestData;
  timeline: TimelineItem[];
  courses: StudyCourse[];
  experiences: WorkExperience[];
  blogTopics: string[];
  posts: BlogPost[];
  interests: InterestItem[];
  siteTexts: Record<string, string>;
}

export interface SitePalette {
  id: string;
  name: string;
  tagline: string;
  isDark: boolean;
  swatches: string[];
  // Page level
  appWrapper: string;
  headerWrapper: string;
  navActiveItem: string;
  navInactiveItem: string;
  // Highlighted Container (now on Pillars!)
  highlightContainer: string;
  highlightGlowTopRight: string;
  highlightGlowBottomLeft: string;
  highlightKicker: string;
  highlightKickerIcon: string;
  highlightKickerDot: string;
  highlightTitle: string;
  highlightSubtitle: string;
  highlightAdminBtn: string;
  // Pillar cards inside highlighted container
  pillarCard: string;
  pillarNumber: string;
  pillarDivider: string;
  pillarTitle: string;
  pillarDesc: string;
  // AI Principles section (now in open/clean section)
  aiSectionKicker: string;
  aiSectionTitle: string;
  aiSectionSubtitle: string;
  aiSectionAdminBtn: string;
  aiCard: string;
  aiRuleTag: string;
  aiRuleIcon: string;
  aiCategoryTag: string;
  aiCardTitle: string;
  aiCardDesc: string;
  aiCardFooter: string;
  // Accents
  timelinePill: string;
  sectionCard: string;
  primaryButton: string;
}

export type AiPrinciplesPalette = SitePalette;

export const SITE_PALETTES: SitePalette[] = [
  {
    id: 'infostrateg',
    name: 'InfoStratég',
    tagline: 'Nový brand vizuál: Hluboká námořnická modř, zářivá smaragdová zeleň a korálový akcent',
    isDark: false,
    swatches: ['#0C1E34', '#34D399', '#78C0E0', '#F05423'],
    appWrapper: 'bg-[#F4F7FA] text-[#0C1E34]',
    headerWrapper: 'bg-[#F4F7FA]/90 backdrop-blur-md border-[#D5E2EC]',
    navActiveItem: 'text-[#0C1E34] font-bold border-[#0C1E34]',
    navInactiveItem: 'text-slate-600 hover:text-[#0C1E34] border-transparent hover:border-[#34D399]',
    highlightContainer: 'bg-gradient-to-br from-[#0C1E34] via-[#0E2644] to-[#0A182A] text-white border-2 border-[#1E3E66] shadow-xl',
    highlightGlowTopRight: 'bg-[#34D399]/25',
    highlightGlowBottomLeft: 'bg-[#78C0E0]/20',
    highlightKicker: 'bg-[#34D399]/15 border border-[#34D399]/50 text-[#6EE7B7] font-semibold',
    highlightKickerIcon: 'text-[#34D399]',
    highlightKickerDot: 'text-[#78C0E0]',
    highlightTitle: 'text-white font-sans font-bold tracking-tight',
    highlightSubtitle: 'text-slate-300 font-light',
    highlightAdminBtn: 'bg-[#34D399] hover:bg-[#10B981] text-[#0C1E34] font-bold shadow-md',
    pillarCard: 'bg-[#0F2642]/95 hover:bg-[#132F52] border-2 border-[#224873] hover:border-[#34D399] text-white shadow-lg transition-all',
    pillarNumber: 'font-mono text-3xl font-bold text-[#34D399] transition-colors',
    pillarDivider: 'bg-[#34D399]',
    pillarTitle: 'text-white font-bold group-hover/pillar:text-[#A7F3D0]',
    pillarDesc: 'text-slate-300 text-sm leading-relaxed',
    aiSectionKicker: 'text-[#0C1E34] font-mono font-semibold',
    aiSectionTitle: 'text-[#0C1E34] font-bold tracking-tight',
    aiSectionSubtitle: 'text-slate-600',
    aiSectionAdminBtn: 'bg-[#0C1E34] hover:bg-[#1A365D] text-white shadow-xs',
    aiCard: 'bg-white hover:bg-slate-50/90 border-2 border-[#D5E2EC] hover:border-[#34D399] shadow-xs hover:shadow-md text-[#0C1E34]',
    aiRuleTag: 'bg-transparent border border-[#34D399] text-[#0C1E34] font-mono font-bold',
    aiRuleIcon: 'text-[#10B981]',
    aiCategoryTag: 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]',
    aiCardTitle: 'text-[#0C1E34] font-bold group-hover/ai:text-[#065F46]',
    aiCardDesc: 'text-slate-600 text-sm leading-relaxed',
    aiCardFooter: 'border-slate-100 text-slate-500',
    timelinePill: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    sectionCard: 'bg-white border-2 border-[#D5E2EC] hover:border-[#34D399]',
    primaryButton: 'bg-[#0C1E34] hover:bg-[#163356] text-white',
  },
  {
    id: 'warm-parchment',
    name: 'Teplý pergamen',
    tagline: 'Světlé přírodní tóny pergamenu, ambry a teplého dřeva bez tmavého pozadí',
    isDark: false,
    swatches: ['#FFFBEB', '#D97706', '#78350F'],
    appWrapper: 'bg-[#FAF7F2] text-stone-900',
    headerWrapper: 'bg-[#FAF7F2]/90 border-amber-200/70',
    navActiveItem: 'text-stone-950 font-semibold border-amber-800',
    navInactiveItem: 'text-stone-600 hover:text-stone-950 border-transparent hover:border-amber-300',
    highlightContainer: 'bg-gradient-to-br from-amber-50/95 via-stone-50 to-orange-50/70 border-2 border-amber-200/90 text-stone-900 shadow-md',
    highlightGlowTopRight: 'bg-amber-300/25',
    highlightGlowBottomLeft: 'bg-orange-300/20',
    highlightKicker: 'bg-amber-100/90 border border-amber-300/90 text-amber-950 font-semibold',
    highlightKickerIcon: 'text-amber-700',
    highlightKickerDot: 'text-amber-500',
    highlightTitle: 'text-stone-900',
    highlightSubtitle: 'text-stone-700',
    highlightAdminBtn: 'bg-stone-900 hover:bg-stone-800 text-white shadow-md',
    pillarCard: 'bg-white/95 hover:bg-white border-2 border-amber-200/80 hover:border-amber-500 shadow-xs hover:shadow-md text-stone-900',
    pillarNumber: 'font-serif text-3xl font-light text-amber-800/60 group-hover/pillar:text-amber-950 transition-colors',
    pillarDivider: 'bg-amber-300 group-hover/pillar:bg-amber-600 transition-colors',
    pillarTitle: 'text-stone-900 group-hover/pillar:text-amber-950',
    pillarDesc: 'text-stone-700',
    aiSectionKicker: 'text-amber-800 font-semibold',
    aiSectionTitle: 'text-stone-900',
    aiSectionSubtitle: 'text-stone-600',
    aiSectionAdminBtn: 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs',
    aiCard: 'bg-white/90 hover:bg-white border border-amber-200/80 hover:border-amber-400/90 shadow-xs hover:shadow-md text-stone-900',
    aiRuleTag: 'bg-transparent border border-amber-300 text-stone-900 font-mono',
    aiRuleIcon: 'text-stone-900',
    aiCategoryTag: 'bg-orange-100 text-orange-950 border border-orange-300/80',
    aiCardTitle: 'text-stone-900 group-hover/ai:text-amber-900',
    aiCardDesc: 'text-stone-700',
    aiCardFooter: 'border-amber-100 text-stone-600',
    timelinePill: 'bg-amber-100 text-amber-900 border-amber-300',
    sectionCard: 'bg-white border border-amber-200/70 hover:border-amber-400',
    primaryButton: 'bg-stone-900 hover:bg-stone-800 text-white',
  },
  {
    id: 'sage-olive',
    name: 'Šalvěj & oliva',
    tagline: 'Harmonické přírodní odstíny šalvěje a lesního mechu pro klidné čtení',
    isDark: false,
    swatches: ['#ECFDF5', '#059669', '#065F46'],
    appWrapper: 'bg-[#F3F7F5] text-stone-900',
    headerWrapper: 'bg-[#F3F7F5]/90 border-emerald-200/70',
    navActiveItem: 'text-stone-950 font-semibold border-emerald-800',
    navInactiveItem: 'text-stone-600 hover:text-stone-950 border-transparent hover:border-emerald-300',
    highlightContainer: 'bg-gradient-to-br from-emerald-50/95 via-stone-50 to-teal-50/70 border-2 border-emerald-200/90 text-stone-900 shadow-md',
    highlightGlowTopRight: 'bg-emerald-300/25',
    highlightGlowBottomLeft: 'bg-teal-300/20',
    highlightKicker: 'bg-emerald-100/90 border border-emerald-300/90 text-emerald-950 font-semibold',
    highlightKickerIcon: 'text-emerald-700',
    highlightKickerDot: 'text-emerald-500',
    highlightTitle: 'text-stone-900',
    highlightSubtitle: 'text-stone-700',
    highlightAdminBtn: 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-md',
    pillarCard: 'bg-white/95 hover:bg-white border-2 border-emerald-200/80 hover:border-emerald-500 shadow-xs hover:shadow-md text-stone-900',
    pillarNumber: 'font-serif text-3xl font-light text-emerald-800/60 group-hover/pillar:text-emerald-950 transition-colors',
    pillarDivider: 'bg-emerald-300 group-hover/pillar:bg-emerald-600 transition-colors',
    pillarTitle: 'text-stone-900 group-hover/pillar:text-emerald-950',
    pillarDesc: 'text-stone-700',
    aiSectionKicker: 'text-emerald-800 font-semibold',
    aiSectionTitle: 'text-stone-900',
    aiSectionSubtitle: 'text-stone-600',
    aiSectionAdminBtn: 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs',
    aiCard: 'bg-white/90 hover:bg-white border border-emerald-200/80 hover:border-emerald-400/90 shadow-xs hover:shadow-md text-stone-900',
    aiRuleTag: 'bg-transparent border border-emerald-300 text-stone-900 font-mono',
    aiRuleIcon: 'text-stone-900',
    aiCategoryTag: 'bg-teal-100 text-teal-950 border border-teal-300/80',
    aiCardTitle: 'text-stone-900 group-hover/ai:text-emerald-900',
    aiCardDesc: 'text-stone-700',
    aiCardFooter: 'border-emerald-100 text-stone-600',
    timelinePill: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    sectionCard: 'bg-white border border-emerald-200/70 hover:border-emerald-400',
    primaryButton: 'bg-emerald-800 hover:bg-emerald-900 text-white',
  },
  {
    id: 'editorial-paper',
    name: 'Editorial tisk',
    tagline: 'Grafický novinový minimalismus s výraznými konturami a bílým podkladem',
    isDark: false,
    swatches: ['#FAFAF9', '#1C1917', '#E7E5E4'],
    appWrapper: 'bg-[#F8F7F5] text-stone-950',
    headerWrapper: 'bg-[#F8F7F5]/90 border-stone-300/90',
    navActiveItem: 'text-stone-950 font-bold border-stone-950',
    navInactiveItem: 'text-stone-600 hover:text-stone-950 border-transparent hover:border-stone-400',
    highlightContainer: 'bg-stone-100/95 border-2 border-stone-300/90 text-stone-900 shadow-md',
    highlightGlowTopRight: 'bg-stone-300/30',
    highlightGlowBottomLeft: 'bg-stone-300/25',
    highlightKicker: 'bg-stone-900 text-white border border-stone-900 font-semibold',
    highlightKickerIcon: 'text-amber-400',
    highlightKickerDot: 'text-stone-400',
    highlightTitle: 'text-stone-950 font-serif',
    highlightSubtitle: 'text-stone-700',
    highlightAdminBtn: 'bg-stone-900 hover:bg-stone-800 text-white shadow-md',
    pillarCard: 'bg-white border-2 border-stone-900 shadow-[4px_4px_0px_rgba(28,25,23,0.18)] hover:shadow-[6px_6px_0px_rgba(28,25,23,0.25)] text-stone-900',
    pillarNumber: 'font-serif text-3xl font-light text-stone-400 group-hover/pillar:text-stone-900 transition-colors',
    pillarDivider: 'bg-stone-900',
    pillarTitle: 'text-stone-950 font-bold group-hover/pillar:text-stone-700',
    pillarDesc: 'text-stone-800',
    aiSectionKicker: 'text-stone-900 font-mono font-semibold',
    aiSectionTitle: 'text-stone-950 font-serif',
    aiSectionSubtitle: 'text-stone-700',
    aiSectionAdminBtn: 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs',
    aiCard: 'bg-white border-2 border-stone-300 hover:border-stone-900 shadow-xs hover:shadow-md text-stone-900',
    aiRuleTag: 'bg-transparent border border-stone-300 text-stone-900 font-mono',
    aiRuleIcon: 'text-stone-900',
    aiCategoryTag: 'bg-stone-100 text-stone-900 border border-stone-300 font-medium',
    aiCardTitle: 'text-stone-950 font-bold group-hover/ai:text-stone-700',
    aiCardDesc: 'text-stone-800',
    aiCardFooter: 'border-stone-200 text-stone-600',
    timelinePill: 'bg-stone-200 text-stone-900 border-stone-400',
    sectionCard: 'bg-white border-2 border-stone-300 hover:border-stone-900',
    primaryButton: 'bg-stone-900 hover:bg-stone-800 text-white',
  },
  {
    id: 'slate-amber',
    name: 'Tlumená břidlice',
    tagline: 'Kouřově šedý tón se zlatým detailem – měkčí a méně tvrdý než černá',
    isDark: true,
    swatches: ['#292524', '#F59E0B', '#1C1917'],
    appWrapper: 'bg-[#181615] text-stone-100',
    headerWrapper: 'bg-[#181615]/95 border-stone-800',
    navActiveItem: 'text-amber-300 font-semibold border-amber-400',
    navInactiveItem: 'text-stone-400 hover:text-stone-200 border-transparent hover:border-stone-700',
    highlightContainer: 'bg-gradient-to-br from-stone-850 via-stone-900 to-stone-850 text-stone-100 border border-stone-700 shadow-xl',
    highlightGlowTopRight: 'bg-amber-500/15',
    highlightGlowBottomLeft: 'bg-stone-700/25',
    highlightKicker: 'bg-amber-500/15 border border-amber-400/40 text-amber-200 font-semibold',
    highlightKickerIcon: 'text-amber-400',
    highlightKickerDot: 'text-amber-500/50',
    highlightTitle: 'text-white',
    highlightSubtitle: 'text-stone-300',
    highlightAdminBtn: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-md',
    pillarCard: 'bg-stone-900/90 hover:bg-stone-900 border border-stone-700 hover:border-amber-400/60 text-stone-100 shadow-md',
    pillarNumber: 'font-serif text-3xl font-light text-amber-400/60 group-hover/pillar:text-amber-300 transition-colors',
    pillarDivider: 'bg-amber-500/60 group-hover/pillar:bg-amber-400 transition-colors',
    pillarTitle: 'text-white group-hover/pillar:text-amber-200',
    pillarDesc: 'text-stone-300',
    aiSectionKicker: 'text-amber-400 font-semibold',
    aiSectionTitle: 'text-white',
    aiSectionSubtitle: 'text-stone-300',
    aiSectionAdminBtn: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-xs',
    aiCard: 'bg-stone-850/80 hover:bg-stone-800 border border-stone-750 hover:border-amber-400/50 text-stone-100 shadow-xs hover:shadow-md',
    aiRuleTag: 'bg-stone-950 border border-stone-700 text-amber-300 font-mono',
    aiRuleIcon: 'text-amber-400',
    aiCategoryTag: 'bg-amber-950/70 text-amber-200 border border-amber-500/40',
    aiCardTitle: 'text-white group-hover/ai:text-amber-200',
    aiCardDesc: 'text-stone-300',
    aiCardFooter: 'border-stone-800 text-stone-400',
    timelinePill: 'bg-stone-800 text-amber-300 border-stone-700',
    sectionCard: 'bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-100',
    primaryButton: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold',
  },
  {
    id: 'oxford-navy',
    name: 'Královská modř',
    tagline: 'Univerzitní tmavě modrá a safírový tón archivního vědeckého výzkumu',
    isDark: true,
    swatches: ['#0F172A', '#38BDF8', '#1E293B'],
    appWrapper: 'bg-[#0B1120] text-slate-100',
    headerWrapper: 'bg-[#0B1120]/95 border-slate-800',
    navActiveItem: 'text-cyan-300 font-semibold border-cyan-400',
    navInactiveItem: 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-700',
    highlightContainer: 'bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-slate-100 border border-slate-700/80 shadow-xl',
    highlightGlowTopRight: 'bg-cyan-500/15',
    highlightGlowBottomLeft: 'bg-indigo-600/20',
    highlightKicker: 'bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 font-semibold',
    highlightKickerIcon: 'text-cyan-400',
    highlightKickerDot: 'text-cyan-500/50',
    highlightTitle: 'text-white',
    highlightSubtitle: 'text-slate-300',
    highlightAdminBtn: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold shadow-md',
    pillarCard: 'bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-300/50 text-slate-100 shadow-md',
    pillarNumber: 'font-serif text-3xl font-light text-cyan-400/60 group-hover/pillar:text-cyan-300 transition-colors',
    pillarDivider: 'bg-cyan-500/60 group-hover/pillar:bg-cyan-400 transition-colors',
    pillarTitle: 'text-white group-hover/pillar:text-cyan-200',
    pillarDesc: 'text-slate-300',
    aiSectionKicker: 'text-cyan-400 font-semibold',
    aiSectionTitle: 'text-white',
    aiSectionSubtitle: 'text-slate-300',
    aiSectionAdminBtn: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold shadow-xs',
    aiCard: 'bg-slate-850/80 hover:bg-slate-800 border border-slate-750 hover:border-cyan-300/50 text-slate-100 shadow-xs hover:shadow-md',
    aiRuleTag: 'bg-slate-950 border border-slate-700 text-cyan-300 font-mono',
    aiRuleIcon: 'text-cyan-400',
    aiCategoryTag: 'bg-indigo-950/80 text-indigo-200 border border-indigo-400/40',
    aiCardTitle: 'text-white group-hover/ai:text-cyan-200',
    aiCardDesc: 'text-slate-300',
    aiCardFooter: 'border-slate-700/70 text-slate-400',
    timelinePill: 'bg-slate-800 text-cyan-300 border-slate-700',
    sectionCard: 'bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100',
    primaryButton: 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold',
  },
];

export const AI_PALETTES = SITE_PALETTES;

export const defaultSiteTexts: Record<string, string> = {
  // Global Site Palette
  "site.colorPalette": "infostrateg",

  // Header
  "header.brand": "InfoStratég",
  "header.navHome": "Úvod & Manifest",
  "header.navTimeline": "Časová osa",
  "header.navStudy": "Studium",
  "header.navExperience": "Zkušenosti",
  "header.navBlog": "Blog",
  "header.navInterests": "Zájmy",
  "header.adminBadge": "Režim úprav",
  "header.logoutBtn": "Odhlásit",
  "header.loginBtn": "Správa portfolia",

  // Hero & Manifest
  "hero.kickerLeft": "InfoStratég",
  "hero.kickerRight": "Hledej kontext.",
  "hero.quoteOrigin": "Východisko mé práce",
  "hero.timelineBtn": "Prozkoumat časovou osu",
  "hero.manifestBtnRead": "Přečíst celý manifest",
  "hero.manifestBtnHide": "Skrýt detailní manifest",
  "hero.modalManifestTitle": "Manifest informační gramotnosti pro 21. století",
  "hero.modalAuthorPrefix": "Autorka:",
  "hero.addParagraphBtn": "Přidat odstavec",
  "hero.pillarsKickerLeft": "Základní filozofie",
  "hero.pillarsKickerRight": "Informační věda",
  "hero.pillarsTitle": "Čtyři pilíře mého přístupu k informacím",
  "hero.pillarsSubtitle": "Hodnotové principy, které provází mé studium, výzkum, lektorování i vizi do budoucna.",
  "hero.addPillarBtn": "Přidat pilíř",

  // AI Principles Section
  "aiPrinciples.colorPalette": "infostrateg",
  "aiPrinciples.kickerLeft": "Etika & Technologie",
  "aiPrinciples.kickerRight": "Odpovědný přístup",
  "aiPrinciples.title": "Mé zásady při práci s umělou inteligencí",
  "aiPrinciples.subtitle": "Jako informační specialistka vnímám generativní AI jako silný nástroj pro rozšíření lidského potenciálu, který však vyžaduje nekompromisní etické mantinely, ověřování faktů a zachování autonomního lidského úsudku.",
  "aiPrinciples.addBtn": "Přidat zásadu",

  // Interactive Timeline
  "timeline.kickerLeft": "Interaktivní časová osa",
  "timeline.kickerRight": "Cesta & Plány",
  "timeline.title": "Odkud jdu, kde jsem a kam směřuji",
  "timeline.subtitle": "Proklikejte se jednotlivými etapami mé profesní i osobní cesty – od prvních rešerší po dlouhodobé vize vzdělávání v éře AI.",
  "timeline.addBtn": "Přidat nový milník",
  "timeline.filterAll": "Všechny etapy",
  "timeline.filterPast": "Odkud jdu (Minulost)",
  "timeline.filterPresent": "Kde jsem (Přítomnost)",
  "timeline.filterFuture": "Kam směřuji (Budoucnost)",
  "timeline.detailsLink": "Podrobnosti",
  "timeline.modalDescTitle": "Popis etapy",
  "timeline.modalReflectionTitle": "Osobní reflexe & význam pro budoucnost",
  "timeline.modalHighlightsTitle": "Klíčové milníky & výsledky",
  "timeline.modalCloseBtn": "Zavřít",

  // Study Section
  "study.backBtn": "Zpět na hlavní portfolio",
  "study.kickerLeft": "Akademická dráha",
  "study.kickerRight": "Absolvované předměty",
  "study.title": "Studium a odborné předměty",
  "study.subtitle": "Přehled kurzů, kterými jsem prošla, v jakém semestru a roce jsem je absolvovala, a především má osobní reflexe toho, co mě naučily.",
  "study.addBtn": "Přidat předmět",
  "study.filterAll": "Všechny semestry",
  "study.searchPlaceholder": "Hledat předmět či dovednost...",
  "study.commentLabel": "Můj komentář & přínos",
  "study.projectLabel": "Semestrální projekt:",

  // Experience Section
  "experience.backBtn": "Zpět na hlavní portfolio",
  "experience.kickerLeft": "Profesní praxe",
  "experience.kickerRight": "Kariéra & Projekty",
  "experience.title": "Pracovní zkušenosti",
  "experience.subtitle": "Pozice, které mám za sebou, časová období a má osobní reflexe toho, jak posunuly mé vnímání informační praxe.",
  "experience.addBtn": "Přidat zkušenost",
  "experience.reflectionLabel": "Osobní reflexe & co mi pozice dala",
  "experience.achievementsLabel": "Hlavní přínos a konkrétní výsledky",
  "experience.skillsLabel": "Dovednosti:",

  // Blog Section
  "blog.backBtn": "Zpět na hlavní portfolio",
  "blog.kickerLeft": "Úvahy & Eseje",
  "blog.kickerRightArchive": "Kompletní archiv blogu",
  "blog.kickerRightHome": "Výběr nejnovějších článků",
  "blog.titleArchive": "Blog: Úvahy o informacích a gramotnosti",
  "blog.titleHome": "Nejnovější z mého blogu",
  "blog.subtitleArchive": "Pravidelné i příležitostné texty, glosy a analýzy ze světa informační vědy, vzdělávání, knižní kultury a osobní produktivity.",
  "blog.subtitleHome": "Ukázka z mých textů věnovaných informační vědě, médiím a kritickému myšlení. Všechny články najdete v archivu.",
  "blog.addPostBtn": "Napsat nový článek",
  "blog.addTopicBtn": "Nové téma",
  "blog.filterAll": "Všechna témata",
  "blog.searchPlaceholder": "Hledat v článcích podle názvu, textu...",
  "blog.readMoreBtn": "Přečíst celý text",
  "blog.ctaBoxTitle": "Chcete si přečíst více článků a témat?",
  "blog.ctaBoxDesc": "V samostatné sekci blogu najdete kompletní archiv textů přehledně rozdělený do témat: Informační gramotnost, Práce s informacemi, Knížky a publikace a Z osobního života.",
  "blog.ctaBoxBtn": "Přejít do kompletního archivu blogu",

  // Interests Section
  "interests.backBtn": "Zpět na hlavní portfolio",
  "interests.kickerLeft": "Volný čas & Regenerace",
  "interests.kickerRightArchive": "Všechny aktivity",
  "interests.kickerRightHome": "4 vybrané zájmy",
  "interests.titleArchive": "Všechny osobní zájmy a vášně",
  "interests.titleHome": "Vybrané zájmy a volný čas",
  "interests.subtitleArchive": "Kompletní přehled všech aktivit, kterým se věnuji mimo práci s daty a výzkum. V administraci můžete hvězdičkou zvolit, které 4 se zobrazí na hlavní stránce.",
  "interests.subtitleHome": "Čtyři vybrané aktivity, které mi pomáhají vypnout hlavu a udržují mou vnitřní rovnováhu. Další najdete v samostatné sekci.",
  "interests.addBtn": "Přidat zájem",
  "interests.viewAllBtn": "Všechny zájmy",

  // Footer
  "footer.brand": "Káťa Kalivodová",
  "footer.role": "Informační věda | Digitální kurátorství | Vzdělávání k informační gramotnosti",
  "footer.navTitle": "Obsah portfolia",
  "footer.navHome": "Úvod & Osobní manifest",
  "footer.navTimeline": "Časová osa: Odkud jdu, kde jsem, kam směřuji",
  "footer.navStudy": "Studium: Absolvované předměty & komentáře",
  "footer.navExperience": "Pracovní zkušenosti & praxe",
  "footer.navBlog": "Blog & články: Úvahy o informacích",
  "footer.navInterests": "Zájmy & osobní vášně",
  "footer.adminTitle": "Správa obsahu",
  "footer.adminDesc": "Portfolio disponuje integrovaným systémem správy dat uložených v prohlížeči.",
  "footer.backupBtn": "Záloha a obnovení dat (JSON)",
  "footer.loginBtn": "Přihlásit se do režimu úprav",
  "footer.copyrightRight": "Informační studia & digitální kurátorství",
  "footer.scrollTopBtn": "Zpět nahoru"
};

export const defaultAiPrinciples: AiPrinciple[] = [
  {
    id: "ai-1",
    category: "Kognitivní asistence",
    title: "AI jako sparring partner, nikoli orákulum pravdy",
    description: "Generativní AI používám pro syntézu rozsáhlých poznámek, brainstorming struktur a hledání protiargumentů. Nikdy ji však nepovažuji za primární vědecký pramen ani za zdroj nezpochybnitelné pravdy."
  },
  {
    id: "ai-2",
    category: "Ověřování & Human-in-the-loop",
    title: "Důsledné křížové ověřování u primárních zdrojů",
    description: "Žádné faktické tvrzení vygenerované modelem nepřijímám bez ověření v recenzovaných databázích (Scopus, Web of Science) či primárních pramenech. Zodpovědnost za pravdivost vždy nese člověk."
  },
  {
    id: "ai-3",
    category: "Transparentnost & Integrita",
    title: "Otevřenost ohledně míry zapojení algoritmů",
    description: "Při výuce, tvorbě metodik i publikování jasně deklaruji, kdy a jakou roli hrály asistenční AI nástroje. Poctivost v autorství a citacích je základem důvěryhodného akademického i veřejného dialogu."
  },
  {
    id: "ai-4",
    category: "Etika & Soukromí dat",
    title: "Ochrana soukromí a striktní datová hygiena",
    description: "Do veřejných komerčních modelů nikdy nevkládám osobní údaje studentů, neveřejné výzkumné záznamy ani důvěrné materiály. Ctím principy ochrany soukromí, autorského práva a digitální bezpečnosti."
  },
  {
    id: "ai-5",
    category: "Vzdělávání k autonomii",
    title: "Posilování kritického úsudku místo slepé závislosti",
    description: "Ve svých workshopech neučím pouhé zadávání promptů, ale rozvíjím schopnost odhalovat halucinace, kognitivní zkreslení modelů a kultivovat samostatné, nezávislé lidské myšlení."
  }
];

export const initialPortfolioData: PortfolioDatabase = {
  siteTexts: defaultSiteTexts,
  manifest: {
    authorName: "InfoStratég",
    authorRole: "High-tech akademický profil informační vědy | @neztrat_se_v_info",
    authorEmail: "kata.kalivodova@gmail.com",
    authorLocation: "Brno / Opálka, Česká republika",
    photoUrl: "/assets/aistudio/profile_picture_c1a456ff.jpeg",
    photoAlt: "InfoStratég – profilový obrázek @neztrat_se_v_info",
    heroHeadline: "Informace bez porozumění jsou jen šum. Hledej kontext.",
    heroSubhead: "High-tech akademický profil informační vědy. Zkoumám kognitivní odolnost, hluboké čtení a etické mantinely práce s daty a umělou inteligencí.",
    manifestQuote: "Informační gramotnost není o tom vědět všechno, ale o schopnosti klást správné otázky a nenechat se oklamat jednoduchými odpověďmi na složité problémy.",
    manifestQuoteAuthor: "InfoStratég",
    manifestPillars: [
      {
        id: "p1",
        title: "Kritické myšlení jako každodenní hygiena",
        description: "Automatické zpochybňování prvního dojmu, identifikace kognitivních zkreslení a neustálé ověřování zdrojů v digitálním prostoru."
      },
      {
        id: "p2",
        title: "Lidský rozměr v algoritmickém věku",
        description: "Technologie a doporučovací algoritmy mají lidskému myšlení rozšiřovat obzory, nikoli vytvářet polarizující názorové bubliny."
      },
      {
        id: "p3",
        title: "Přístupnost a srozumitelnost vědění",
        description: "Demokratizace přístupu k vědeckým poznatkům, architektonicky čisté uspořádání znalostí a empatický design informačních systémů."
      },
      {
        id: "p4",
        title: "Odpovědnost a etika kurátorství",
        description: "Péče o data jako o kulturní dědictví, respekt k duševnímu vlastnictví a aktivní boj proti dezinformačnímu zmatku."
      }
    ],
    aiPrinciples: defaultAiPrinciples,
    fullManifestText: [
      "Když jsem poprvé začala zkoumat, jak se lidé orientují ve světě online vyhledávání a sociálních sítí, zarazilo mě, jak snadno zaměňujeme rychlost za pravdivost a množství za kvalitu.",
      "Práce s informacemi pro mě není suchá věda o databázích. Je to most mezi lidskou kognicí a neustále se rozpínajícím digitálním vesmírem. Každý den se snažím propojovat analytickou preciznost rešeršních metod s empatií ke studentům, čtenářům i uživatelům.",
      "Moje vize spočívá v kultivaci informačního prostředí, kde člověk není pasivním příjemcem předžvýkaného obsahu, ale sebevědomým badatelem s rozvinutým citem pro pravdivost, kontext a etiku."
    ]
  },
  timeline: [
    {
      id: "tl-1",
      phase: "past",
      phaseLabel: "Odkud jdu",
      timePeriod: "2019 – 2021",
      title: "První objevování kouzla archivů a textu",
      subtitle: "Humanitní gymnázium a fascinace strukturou informací",
      organization: "Gymnázium & Městská knihovna",
      location: "Jižní Morava",
      description: "První systematické rešeršní práce a studentské projekty. Objevila jsem, jak zásadní rozdíl dělá to, zda člověk čte primární prameny, nebo přejímá neověřená shrnutí.",
      personalReflection: "Tady vzniklo mé rozhodnutí nevěnovat se pouhému pasivnímu studiu textů, ale zkoumat samotný proces, jakým informace vznikají, jak jsou klasifikovány a jak ovlivňují naše rozhodování.",
      keyHighlights: [
        "Vedení studentského literárního a diskusního kroužku",
        "Úspěšná práce v SOČ zaměřená na analýzu pramenů a mediálního obrazu",
        "První dobrovolnictví v digitalizaci regionálních tisků"
      ],
      tags: ["Počátky", "Kritické myšlení", "Archivy"]
    },
    {
      id: "tl-2",
      phase: "past",
      phaseLabel: "Odkud jdu",
      timePeriod: "2021 – 2023",
      title: "Vstup do světa informačních studií",
      subtitle: "Od základů rešerší po architekturu digitálních repozitářů",
      organization: "Univerzitní studium informační vědy",
      location: "Brno",
      description: "Hloubkové seznámení s metodikou vyhledávání v odborných databázích (Scopus, Web of Science, EBSCO), taxonomiemi, ontologiemi a základy UX designu.",
      personalReflection: "Pochopila jsem, že uspořádat informaci logicky pro lidský mozek je stejně důležité umění jako samotné programování vyhledávacího algoritmu.",
      keyHighlights: [
        "Návrh rešeršních strategií pro mezioborové akademické výzkumy",
        "Seminární práce o evaluaci věrohodnosti online zdrojů",
        "Stáž na digitalizačním pracovišti a práce s metadaty"
      ],
      tags: ["Informační věda", "Rešerše", "Metadata"]
    },
    {
      id: "tl-3",
      phase: "present",
      phaseLabel: "Kde jsem",
      timePeriod: "2023 – současnost",
      title: "Aktivní lektorování a výzkum informačního chování",
      subtitle: "Propojování akademických poznatků s živou praxí",
      organization: "Centrum informačního vzdělávání & Univerzita",
      location: "Brno / Praha",
      description: "Pravidelně vedu interaktivní semináře informační gramotnosti pro středoškoláky i dospělé. Soustředím se na dezinformace, kognitivní biasy a efektivní práci s vědeckými podklady.",
      personalReflection: "Vidět ten moment, kdy účastník workshopu sám odhalí manipulativní argumentační faul nebo dokáže najít primární studii místo bulvárního titulku, je pro mě největším motorem.",
      keyHighlights: [
        "Odučeno více než 45 hodin interaktivních vzdělávacích modulů",
        "Vytvoření metodických pracovních listů 'Informační detektiv'",
        "Spolupráce na výzkumu vnímání generativní AI mezi studenty"
      ],
      tags: ["Lektorování", "Informační gramotnost", "Současnost"]
    },
    {
      id: "tl-4",
      phase: "present",
      phaseLabel: "Kde jsem",
      timePeriod: "2024 – současnost",
      title: "Informační architektura a UX znalostních portálů",
      subtitle: "Navrhování přívětivých cest k důležitým poznatkům",
      organization: "Knihovní a komunitní projekty",
      location: "Česká republika",
      description: "Pracuji na optimalizaci struktur webových rozhraní, navigací a přístupnosti informačních zdrojů. Aplikuji card sorting, uživatelské testování a principy čistého obsahu.",
      personalReflection: "Minimalismus v designu není estetický rozmar – je to projev úcty k pozornosti uživatele. Čím méně zbytečných překážek v rozhraní je, tím lépe se člověk může soustředit na podstatu.",
      keyHighlights: [
        "Uživatelské testování katalogových rozhraní se seniory i mladými lidmi",
        "Revize informační architektury vzdělávacího komunitního webu",
        "Implementace principů bezbariérovosti (WCAG) do správy obsahu"
      ],
      tags: ["UX", "Informační architektura", "Uživatelský výzkum"]
    },
    {
      id: "tl-5",
      phase: "future",
      phaseLabel: "Kam směřuji",
      timePeriod: "2025 – 2027",
      title: "Integrace AI gramotnosti do veřejného vzdělávání",
      subtitle: "Kurikulum pro novou éru syntetických informací",
      organization: "Vize pro inovativní vzdělávání a knihovny",
      location: "Střední Evropa",
      description: "Plánuji vytvořit ucelený, volně dostupný vzdělávací rámec, který naučí lidi nejen používat velké jazykové modely a AI nástroje, ale především kriticky prověřovat jejich výstupy a halucinace.",
      personalReflection: "S nástupem AI se role informačního specialisty nemění v tom, co děláme, ale v jakém měřítku. Budeme kurátory lidské soudnosti v moři syntetických dat.",
      keyHighlights: [
        "Vydání praktické příručky 'Jak mluvit s AI a neztratit vlastní úsudek'",
        "Pilotní testování vzdělávacích workshopů v síti krajských knihoven",
        "Mezinárodní stáž se zaměřením na digitální epistemologii"
      ],
      tags: ["Budoucnost", "AI gramotnost", "Vzdělávací vize"]
    },
    {
      id: "tl-6",
      phase: "future",
      phaseLabel: "Kam směřuji",
      timePeriod: "2028 a dál",
      title: "Budování udržitelných znalostních ekosystémů",
      subtitle: "Strategické poradenství a etické informační systémy",
      organization: "Dlouhodobá profesní vize",
      location: "Globální přesah",
      description: "Chtěla bych vést projekty, které pomáhají institucím a organizacím stavět etické, transparentní a dlouhodobě udržitelné archivy znalostí, které nepodléhají komerčnímu zkreslení.",
      personalReflection: "Chci, aby za mnou zůstávaly systémy a lidé, kteří se nenechají opít rohlíkem a mají odvahu hledat pravdivý kontext.",
      keyHighlights: [
        "Založení expertní platformy pro audit informační kvality",
        "Mentoring mladých informačních vědců a knihovníků",
        "Publikační činnost o etice uchovávání digitální paměti"
      ],
      tags: ["Strategie", "Dlouhodobá vize", "Etika znalostí"]
    }
  ],
  courses: [
    {
      id: "c-1",
      code: "INF-101",
      title: "Informační gramotnost a didaktické metody",
      semester: "ZS",
      academicYear: "2023/2024",
      institution: "Filozofická fakulta / Informační studia",
      credits: 6,
      status: "Absolvováno s vyznamenáním",
      comment: "Zásadní předmět, který mě nasměroval k lektorování. Zjistila jsem, jak obrovský rozdíl je mezi tím, když informaci znáte sami, a když dokážete vytvořit bezpečný prostor, kde si na princip ověření přijde student sám.",
      competencies: ["Tvorba lekcí", "Didaktika pro dospělé", "Formativní hodnocení", "Boj s kognitivními biasy"],
      keyProject: "Komplexní výukový scénář 'Jak odhalit manipulaci v grafu' pro střední školy."
    },
    {
      id: "c-2",
      code: "INF-108",
      title: "Rešeršní strategie a práce s odbornými zdroji",
      semester: "LS",
      academicYear: "2023/2024",
      institution: "Filozofická fakulta / Informační studia",
      credits: 5,
      status: "Absolvováno",
      comment: "Pilíř technické stránky oboru. Zvládla jsem pokročilé booleovské operátory, proximity vyhledávání, řízené slovníky (MeSH, Eurovoc) a systematické rešerše pro vědecké přehledy.",
      competencies: ["Systematické rešerše", "Booleovská logika", "Bibliometrie", "Citace a citační etika"],
      keyProject: "Systematická rešerše k dopadům sociálních sítí na pozornost dospívajících (přes 400 zmapovaných zdrojů)."
    },
    {
      id: "c-3",
      code: "INF-204",
      title: "Informační architektura a UX výzkum",
      semester: "ZS",
      academicYear: "2024/2025",
      institution: "Filozofická fakulta / Informační studia",
      credits: 6,
      status: "Absolvováno s vyznamenáním",
      comment: "Naučila jsem se strukturovat složitý obsah tak, aby se v něm člověk neztrácel. Praktické testování s reálnými uživateli mi ukázalo, jak často designéři předpokládají znalosti, které běžný návštěvník vůbec nemá.",
      competencies: ["Card sorting", "Tree testing", "Wireframing", "Navigační schémata", "WCAG standardy"],
      keyProject: "Kompletní redesign informační architektury fakultního digitálního repozitáře."
    },
    {
      id: "c-4",
      code: "INF-215",
      title: "Datová žurnalistika, vizualizace a etika dat",
      semester: "LS",
      academicYear: "2024/2025",
      institution: "Katedra mediálních studií & Informační věda",
      credits: 5,
      status: "Absolvováno",
      comment: "Čísla nelžou, ale lidé s čísly mohou lhát velmi přesvědčivě. Předmět mi dal skvělý vhled do toho, jak vybírat správné typy vizualizací a jak číst statistická data bez senzacechtivosti.",
      competencies: ["Explorativní analýza dat", "Čištění datových sad", "Etická vizualizace", "Práce s otevřenými daty"],
      keyProject: "Interaktivní vizualizace vývoje návštěvnosti a financování veřejných knihoven v ČR za posledních 10 let."
    },
    {
      id: "c-5",
      code: "INF-301",
      title: "Etika informací, autorské právo a otevřená věda",
      semester: "ZS",
      academicYear: "2025/2026",
      institution: "Filozofická fakulta",
      credits: 4,
      status: "Absolvováno s vyznamenáním",
      comment: "Hluboká reflexe duševního vlastnictví, Creative Commons licencí a hnutí Open Access. Uvědomila jsem si, jak důležité je, aby výsledky veřejně financovaného výzkumu nebyly uzamčeny za drahými paywally.",
      competencies: ["Open Access", "Autorské právo v digitálu", "Licencování CC", "Etika uchovávání dat"],
      keyProject: "Analýza bariér v publikování v režimu Open Access mezi začínajícími českými vědci."
    },
    {
      id: "c-6",
      code: "INF-310",
      title: "Organizace znalostí, ontologie a sémantický web",
      semester: "LS",
      academicYear: "2025/2026",
      institution: "Informační studia a knihovnictví",
      credits: 5,
      status: "V průběhu / Dokončeno",
      comment: "Jak naučit stroje chápat vztahy mezi pojmy. Propojení tradičního knihovního třídění s moderními sémantickými grafy a technologiemi jako RDF a SPARQL.",
      competencies: ["Znalostní grafy", "Ontologie", "Taxonomie", "Sémantické metadatové standardy"],
      keyProject: "Návrh doménové ontologie pro komunitní vzdělávací programy v neformálním vzdělávání."
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Lektorka informačního vzdělávání a kritického myšlení",
      organization: "Vzdělávací spolek & Partnerské střední školy",
      period: "09/2024 – dosud",
      isCurrent: true,
      location: "Brno a Jihomoravský kraj",
      type: "Částečný úvazek / Lektorská činnost",
      summary: "Příprava a samostatné vedení interaktivních workshopů zaměřených na ověřování online zpráv, rozpoznávání manipulací, práci s vědeckými fakty a efektivní vyhledávání.",
      comment: "Tato práce mi dává obrovský smysl. Vidím naživo, s jakými dilematy a tlaky se mladí lidé na sociálních sítích potýkají, a pomáhám jim budovat zdravou skepsi bez toho, aby upadli do cynismu.",
      achievements: [
        "Odcvičila jsem workshopy pro více než 600 studentů a desítky pedagogů",
        "Vytvořila jsem sérii 6 interaktivních případových studií 'Detektiv pravdy'",
        "Získala jsem 96% pozitivní zpětnou vazbu z hodnotících dotazníků"
      ],
      skills: ["Prezentační dovednosti", "Facilitace diskuse", "Didaktický design", "Metodika vzdělávání"]
    },
    {
      id: "exp-2",
      role: "Rešeršní asistentka a kurátorka digitálního obsahu",
      organization: "Knihovnické a informační centrum",
      period: "02/2023 – 08/2024",
      isCurrent: false,
      location: "Brno",
      type: "Odborná stáž & Asistence",
      summary: "Zpracování tematických rešerší na zakázku pro studenty a výzkumníky, správa bibliografických záznamů v institucionálním repozitáři a katalogizace nových akvizic.",
      comment: "Byla to škola trpělivosti a preciznosti. Naučila jsem se bleskově orientovat v oborech, o kterých jsem dříve neměla tušení – od molekulární biologie po dějiny architektury.",
      achievements: [
        "Zpracovala jsem přes 70 komplexních odborných rešerší",
        "Optimalizovala jsem vyhledávací tagy a klíčová slova v repozitáři",
        "Vytvořila jsem přehledného průvodce licencováním pro autory závěrečných prací"
      ],
      skills: ["Odborné rešerše", "Katalogizace", "Konzultační činnost", "Databázové systémy"]
    },
    {
      id: "exp-3",
      role: "Stážistka informační architektury a obsahu",
      organization: "Neziskový portál pro otevřená data",
      period: "06/2023 – 12/2023",
      isCurrent: false,
      location: "Praha / Remote",
      type: "Projektová stáž",
      summary: "Analýza obsahu webu, uživatelské testování informačních stromů a návrh srozumitelnějších textů (UX writing) pro laickou veřejnost.",
      comment: "Uvědomila jsem si, že i ta nejlepší veřejná data jsou k ničemu, pokud jsou zahrabána pod nepochopitelnou hantýrkou a nepřehlednou strukturou odkazů.",
      achievements: [
        "Provedla jsem hloubkový audit informační struktury 120 podstránek",
        "Zrealizovala jsem 8 hloubkových uživatelských rozhovorů a card sorting",
        "Výrazně zkrátila čas potřebný k nalezení klíčových datasetů o 40 %"
      ],
      skills: ["UX Writing", "Uživatelské testování", "Informační audity", "Figma wireframing"]
    }
  ],
  blogTopics: [
    "Informační gramotnost",
    "Práce s informacemi",
    "Knížky a publikace",
    "Z osobního života"
  ],
  posts: [
    {
      id: "post-1",
      title: "Jak naučit studenty číst data bez strachu a manipulace",
      topic: "Informační gramotnost",
      date: "28. října 2025",
      readTime: "5 min čtení",
      imageUrl: "/src/assets/images/blog_info_literacy_1793721968918.jpg",
      annotation: "Praktická reflexe z mých workshopů na středních školách – proč grafy bez kontextu matou a jak vytvořit bezpečný prostor pro zvídavost místo pasivního přejímání titulků.",
      featuredQuote: "Informační gramotnost nezačíná u sofistikovaných vyhledávacích operátorů, ale u odvahy přiznat si: ‚Tohle ještě nevím, musím se podívat ke zdroji.‘",
      content: [
        "Když jsem začínala lektorovat na středních školách, často jsem narážela na to, že studenti nepovažují ověřování informací za dovednost, ale za **nudnou povinnost**. Dokud jim neukážete, jak snadno lze pomocí oříznuté osy Y v grafu vyrobit z nepatrné odchylky dramatickou senzaci.",
        "![Ukázka z praktického workshopu: Rozbor klamavého grafu na reálných datech z médií](/src/assets/images/blog_digital_wellbeing_1793721966575.jpg)",
        "### Hra na informační detektivy",
        "Místo teoretických přednášek o metodách fakt-checkingu jsme začali hrát hru na informační detektivy. Každý tým dostane virální příspěvek a má za úkol dohledat ==původní vědeckou studii==, ze které tvrzení vzešlo. Ten moment, kdy zjistí, že původní výzkum byl proveden na deseti myších a bulvár z toho udělal univerzální lék, je k nezaplacení.",
        "> Klíčem k úspěchu není moralizovat, ale probudit přirozený detektivní instinkt. Jakmile mladý člověk zažije radost z odhalení kontextu, jeho informační imunita dramaticky vzroste."
      ],
      tags: ["Didaktika", "Kritické myšlení", "Grafy", "Školství"]
    },
    {
      id: "post-2",
      title: "Kurátorství poznatků v éře syntetického obsahu",
      topic: "Práce s informacemi",
      date: "14. října 2025",
      readTime: "6 min čtení",
      imageUrl: "/src/assets/images/blog_digital_wellbeing_1793721966575.jpg",
      annotation: "Když jazykové modely chrlí odpovědi během vteřiny, cena lidského ověření, hluboké kontextualizace a etického třídění strmě roste.",
      featuredQuote: "V moři automaticky vygenerovaného textu se lidský úsudek stává nejvzácnějším a nejpotřebnějším kurátorským nástrojem.",
      content: [
        "Žijeme v době, kdy generování textu přestalo být bariérou. Stačí jeden prompt a obrazovka se zaplní uhlazenými větami. Co však dramaticky ztrácíme, je jistota, z jakých epistemologických kořenů tyto odpovědi vyrůstají.",
        "Práce informačního specialisty se tím nemění k horšímu, právě naopak. Z rešeršérů hledajících jehlu v kupce sena se stáváme architekty důvěry. Naší rolí je auditovat algoritmy, zkoumat halucinace a udržovat most mezi digitálními modely a ověřenými historickými prameny.",
        "AI je fantastický kompas, ale špatný kormidelník. Pokud jí předáme odpovědnost za formulaci pravdy, ztratíme schopnost rozlišovat mezi tím, co zní přesvědčivě, a tím, co je skutečně podloženo fakty."
      ],
      tags: ["AI", "Epistemologie", "Metadata", "Kurátorství"]
    },
    {
      id: "post-3",
      title: "Tři knihy, které změnily můj pohled na organizaci vědění",
      topic: "Knížky a publikace",
      date: "2. září 2025",
      readTime: "4 min čtení",
      imageUrl: "/src/assets/images/interest_books_reading_1793720231318.jpg",
      annotation: "O tom, jak fyzická architektura knihoven, klasifikační systémy a filozofie třídění předurčují, jakým způsobem vnímáme svět a vztahy mezi myšlenkami.",
      featuredQuote: "Kniha není jen papírové médium pro text, je to ohraničený prostor pro soustředění a trpělivost, kterou nám dnešní digitální rozhraní systematicky kradou.",
      content: [
        "Když jsem nastupovala na obor informačních studií, myslela jsem si, že klasifikace je nudná technická záležitost plná čísel MDT a lístkových katalogů. Teprve kniha 'Všechno je různé' od Davida Weinbergera mi otevřela oči.",
        "Uvědomila jsem si, že každý způsob, jakým věci třídíme – od regálu v knihovně přes adresářovou strukturu po tagy na webu – nese určitý světonázor. Žádná taxonomie není neutrální.",
        "Spolu s Bachelardovou 'Poetikou prostoru' a Papanekovým 'Designem pro reálný svět' tvoří tyto knihy trojúhelník, který mě neustále nutí ptát se: Pro koho tuto informaci organizujeme a jak jí pomoci, aby sloužila dobrému životu?"
      ],
      tags: ["Knihy", "Knihovny", "Filozofie", "Slow Reading"]
    },
    {
      id: "post-4",
      title: "Co mě horské přechody naučily o digitálním detoxu a pozornosti",
      topic: "Z osobního života",
      date: "18. srpna 2025",
      readTime: "5 min čtení",
      imageUrl: "/src/assets/images/interest_mountain_hiking_1793720233561.jpg",
      annotation: "Osobní zápisky z týdne na hřebenech bez telefonního signálu. Jak se po návratu do online světa mění vnímání informačního šumu a co si z hor odnáším do práce.",
      featuredQuote: "Když vypnete notifikace, zjistíte, že většina věcí, které se tváří jako urgentní, jsou ve skutečnosti jen hlasité.",
      content: [
        "Většinu svého profesního života trávím před obrazovkami. Analyzuji toky dat, procházím desítky otevřených tabů a sleduji sociální sítě. Proto pro mě hory znamenají naprosto zásadní protiváhu.",
        "První dva dny bez signálu v těle dojíždí syndrom fantomových vibrací v kapse. Hlava automaticky hledá okamžitý dopaminový impuls. Třetí den se ale stane něco zvláštního – pozornost se začne rozprostírat do prostoru. Všimnete si proměny světla na protějším štítu, rytmu vlastního dechu a vůně jehličí.",
        "Z hor se nevracím jako někdo, kdo by chtěl zahodit technologie. Vracím se s hlubokým vědomím, že pozornost je naše nejcennější neobnovitelná měna. A že ji musíme chránit před zbytečným plýtváním."
      ],
      tags: ["Osobní", "Hory", "Digitální detox", "Pozornost"]
    },
    {
      id: "post-5",
      title: "Didaktika pro 21. století: Od pasivního posluchače k informačnímu detektivovi",
      topic: "Informační gramotnost",
      date: "5. července 2025",
      readTime: "7 min čtení",
      imageUrl: "/src/assets/images/interest_community_workshop_1793720232486.jpg",
      annotation: "Jak navrhovat vzdělávací moduly, které netrestají za chybu, ale probouzejí radost z kritického pátrání po faktech v reálném životě.",
      featuredQuote: "Lidé se nechtějí nechat poučovat o tom, co je správné. Chtějí sami přijít na kloub tomu, jak věci doopravdy fungují.",
      content: [
        "Tradiční výuka mediální a informační gramotnosti často selhává na tom, že přistupuje k lidem z pozice morální nadřazenosti: 'My vám vysvětlíme, čemu nesmíte věřit.' Takový přístup spolehlivě vyvolává odpor.",
        "Když jsme naopak workshop postavili jako řešení konkrétní záhady, kde účastníci dostanou k dispozici pouze vyhledávač, otevřená data a archivní záznamy, atmosféra se okamžitě proměnila. Lidé se baví, hádají se nad fakty a sami přirozeně dochází k závěrům.",
        "Vzdělávání není nalévání vědomostí do prázdných nádob, ale zažehnutí plamene kritické zvídavosti."
      ],
      tags: ["Didaktika", "Workshopy", "Facilitace", "Metodika"]
    }
  ],
  interests: [
    {
      id: "int-1",
      title: "Pomalé analogové čtení",
      category: "Knihy & myšlení",
      imageUrl: "/src/assets/images/interest_books_reading_1793720231318.jpg",
      activityFrequency: "Každodenní ranní rituál",
      personalNote: "Káva a dlouhý tištěný text předtím, než otevřu první displej. Pomáhá mi nastartovat hluboké soustředění a udržet klidnou mysl.",
      featuredOnHome: true,
      tags: ["Knihy", "Slow reading", "Rituál"]
    },
    {
      id: "int-2",
      title: "Analogová 35mm fotografie",
      category: "Vizuální tvorba",
      imageUrl: "/src/assets/images/interest_analog_photo_1793720230936.jpg",
      activityFrequency: "Na cestách a při toulkách městem",
      personalNote: "Klasický kinofilm a mechanická Leica. 36 políček mě učí vážit si každého záběru, vnímat světlo a nespěchat.",
      featuredOnHome: true,
      tags: ["35mm film", "Dokument", "Trpělivost"]
    },
    {
      id: "int-3",
      title: "Horská turistika & treking",
      category: "Pohyb & příroda",
      imageUrl: "/src/assets/images/interest_mountain_hiking_1793720233561.jpg",
      activityFrequency: "Víkendové přechody a letní expedice",
      personalNote: "S batohem do sedel a na hřebeny. Místo, kde utichá informační šum a zůstává jen rytmus kroků a čistý obzor.",
      featuredOnHome: true,
      tags: ["Hory", "Příroda", "Detox"]
    },
    {
      id: "int-4",
      title: "Komunitní setkávání & debaty",
      category: "Lidé & společnost",
      imageUrl: "/src/assets/images/interest_community_workshop_1793720232486.jpg",
      activityFrequency: "Pravidelné měsíční kruhy a akce",
      personalNote: "Papíry, fixy, dobrý čaj a otevřená diskuse. Sdílení myšlenek tváří v tvář bez algoritmických filtrů.",
      featuredOnHome: true,
      tags: ["Komunita", "Diskuse", "Spolupráce"]
    },
    {
      id: "int-5",
      title: "Kaligrafie & tvorba písma",
      category: "Řemeslo & design",
      imageUrl: "/src/assets/images/blog_info_literacy_1793721968918.jpg",
      activityFrequency: "Klidné tvořivé večery",
      personalNote: "Psaní redisperem a inkoustem na morušový papír. Fyzický zážitek z rytmu písma, kde neexistuje tlačítko zpět.",
      featuredOnHome: false,
      tags: ["Kaligrafie", "Typografie", "Řemeslo"]
    },
    {
      id: "int-6",
      title: "Deskové & strategické hry",
      category: "Strategie & hra",
      imageUrl: "/src/assets/images/blog_digital_wellbeing_1793721966575.jpg",
      activityFrequency: "Páteční herní večery s přáteli",
      personalNote: "Fascinují mě elegantní herní mechanismy, teorie kooperace a řešení komplexních herních plánů.",
      featuredOnHome: false,
      tags: ["Hry", "Strategie", "Logika"]
    }
  ]
};

const STORAGE_KEY = 'portfolio_kata_kalivodova_db_v3';
const ADMIN_SESSION_KEY = 'portfolio_kata_admin_session';

export function getStoredPortfolioData(): PortfolioDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialPortfolioData;
    const parsed = JSON.parse(raw);
    const mergedSiteTexts = { ...defaultSiteTexts, ...(parsed.siteTexts || {}) };
    if (
      !mergedSiteTexts['site.colorPalette'] ||
      mergedSiteTexts['site.colorPalette'] === 'warm-parchment' ||
      mergedSiteTexts['site.colorPalette'] === 'editorial-paper'
    ) {
      mergedSiteTexts['site.colorPalette'] = 'infostrateg';
    }
    if (mergedSiteTexts['header.brand'] === 'Káťa Kalivodová') {
      mergedSiteTexts['header.brand'] = 'InfoStratég';
    }
    if (mergedSiteTexts['hero.kickerLeft'] === 'Osobní manifest & portfolio') {
      mergedSiteTexts['hero.kickerLeft'] = 'InfoStratég';
    }
    if (mergedSiteTexts['hero.kickerRight'] === 'Informační gramotnost') {
      mergedSiteTexts['hero.kickerRight'] = 'Hledej kontext.';
    }

    const currentPhoto = parsed.manifest?.photoUrl;
    const finalPhoto =
      !currentPhoto ||
      currentPhoto.includes('portrait_kata_manifest') ||
      currentPhoto === '/src/assets/images/portrait_kata_manifest_1793720229771.jpg'
        ? '/assets/aistudio/profile_picture_c1a456ff.jpeg'
        : currentPhoto;

    const manifestData = {
      ...initialPortfolioData.manifest,
      ...(parsed.manifest || {}),
      photoUrl: finalPhoto,
      photoAlt: 'InfoStratég – profilový obrázek @neztrat_se_v_info',
      authorName:
        parsed.manifest?.authorName === 'Káťa Kalivodová'
          ? 'InfoStratég'
          : (parsed.manifest?.authorName || 'InfoStratég'),
      authorLocation:
        parsed.manifest?.authorLocation && parsed.manifest.authorLocation !== '@neztrat_se_v_info | Hledej kontext.'
          ? parsed.manifest.authorLocation
          : 'Brno / Opálka, Česká republika',
      authorRole:
        parsed.manifest?.authorRole?.includes('Informační věda | Digitální kurátorství')
          ? 'High-tech akademický profil informační vědy | @neztrat_se_v_info'
          : (parsed.manifest?.authorRole || 'High-tech akademický profil informační vědy | @neztrat_se_v_info'),
      aiPrinciples:
        parsed.manifest && parsed.manifest.aiPrinciples && parsed.manifest.aiPrinciples.length > 0
          ? parsed.manifest.aiPrinciples
          : defaultAiPrinciples,
    };

    return {
      siteTexts: mergedSiteTexts,
      manifest: manifestData,
      timeline: sortTimelineItems(parsed.timeline || initialPortfolioData.timeline),
      courses: parsed.courses || initialPortfolioData.courses,
      experiences: parsed.experiences || initialPortfolioData.experiences,
      posts: (parsed.posts || initialPortfolioData.posts) as BlogPost[],
      blogTopics: ((parsed.blogTopics || initialPortfolioData.blogTopics) as string[]).filter((t: string) =>
        (parsed.posts || initialPortfolioData.posts).some((p: BlogPost) => p.topic === t)
      ),
      interests: parsed.interests || initialPortfolioData.interests,
    };
  } catch (e) {
    console.error("Chyba při čtení dat z localStorage:", e);
    return initialPortfolioData;
  }
}

export function saveStoredPortfolioData(data: PortfolioDatabase): void {
  try {
    const cleanData: PortfolioDatabase = {
      ...data,
      blogTopics: data.blogTopics.filter((t) => data.posts.some((p) => p.topic === t)),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
  } catch (e) {
    console.error("Chyba při ukládání do localStorage:", e);
  }
}

export function resetStoredPortfolioData(): PortfolioDatabase {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  return initialPortfolioData;
}

export function getAdminSession(): boolean {
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminSession(isLoggedIn: boolean): void {
  try {
    if (isLoggedIn) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    console.error(e);
  }
}
