import { ArrowUp, Instagram, MapPin, Database } from 'lucide-react';
import { InlineText } from './InlineEdit';
import { getSiteText } from '../data/portfolioData';

interface FooterProps {
  authorName: string;
  authorRole: string;
  authorEmail: string;
  authorLocation: string;
  siteTexts?: Record<string, string>;
  onUpdateSiteText?: (key: string, value: string) => void;
  onOpenBackup: () => void;
  onOpenLogin: () => void;
  isAdmin: boolean;
  onNavigate?: (view: 'home' | 'study' | 'experience' | 'blog', anchor?: string) => void;
}

export function Footer({
  authorName,
  authorRole,
  authorEmail,
  authorLocation,
  siteTexts = {},
  onUpdateSiteText,
  onOpenBackup,
  onOpenLogin,
  isAdmin,
  onNavigate,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A192F] text-slate-300 py-12 md:py-16 border-t border-[#1E3A5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-[#1E3A5F]">
          
          {/* Column 1: Brand & Role */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-[#34D399] shadow-xs shrink-0 bg-[#0C1E34]">
                <img
                  src="/assets/aistudio/profile_picture_c1a456ff.jpeg"
                  alt="InfoStratég"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                <InlineText
                  value={getSiteText(siteTexts, 'footer.brand', authorName)}
                  onSave={(val) => onUpdateSiteText?.('footer.brand', val)}
                  isAdmin={isAdmin}
                  label="Jméno v patičce"
                />
              </h3>
            </div>
            <div className="text-sm text-stone-400 max-w-sm leading-relaxed font-normal">
              <InlineText
                value={getSiteText(siteTexts, 'footer.role', authorRole)}
                onSave={(val) => onUpdateSiteText?.('footer.role', val)}
                isAdmin={isAdmin}
                multiline
                rows={2}
                label="Role v patičce"
              />
            </div>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
                <a
                  href="https://www.instagram.com/neztrat_se_v_info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-semibold text-slate-200 hover:underline inline-flex items-center gap-1.5"
                  title="Sledovat InfoStratég na Instagramu"
                >
                  <span>@neztrat_se_v_info</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Instagram)</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{authorLocation}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-3">
              <InlineText
                value={getSiteText(siteTexts, 'footer.navTitle', 'Obsah portfolia')}
                onSave={(val) => onUpdateSiteText?.('footer.navTitle', val)}
                isAdmin={isAdmin}
                label="Nadpis sekce odkazů v patičce"
              />
            </span>
            <ul className="space-y-2 text-sm">
              <li>
                <div
                  onClick={() => onNavigate ? onNavigate('home', '#uvod') : window.location.hash = '#uvod'}
                  className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                >
                  <InlineText
                    value={getSiteText(siteTexts, 'footer.navHome', 'Úvod & Osobní manifest')}
                    onSave={(val) => onUpdateSiteText?.('footer.navHome', val)}
                    isAdmin={isAdmin}
                    label="Odkaz Úvod v patičce"
                  />
                </div>
              </li>
              <li>
                <div
                  onClick={() => onNavigate ? onNavigate('home', '#timeline') : window.location.hash = '#timeline'}
                  className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                >
                  <InlineText
                    value={getSiteText(siteTexts, 'footer.navTimeline', 'Časová osa: Odkud jdu, kde jsem, kam směřuji')}
                    onSave={(val) => onUpdateSiteText?.('footer.navTimeline', val)}
                    isAdmin={isAdmin}
                    label="Odkaz Časová osa v patičce"
                  />
                </div>
              </li>
              <li>
                <div
                  onClick={() => onNavigate ? onNavigate('study') : window.location.hash = '#studium'}
                  className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                >
                  <InlineText
                    value={getSiteText(siteTexts, 'footer.navStudy', 'Studium: Absolvované předměty & komentáře')}
                    onSave={(val) => onUpdateSiteText?.('footer.navStudy', val)}
                    isAdmin={isAdmin}
                    label="Odkaz Studium v patičce"
                  />
                </div>
              </li>
              <li>
                <div
                  onClick={() => onNavigate ? onNavigate('experience') : window.location.hash = '#zkusenosti'}
                  className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                >
                  <InlineText
                    value={getSiteText(siteTexts, 'footer.navExperience', 'Pracovní zkušenosti & praxe')}
                    onSave={(val) => onUpdateSiteText?.('footer.navExperience', val)}
                    isAdmin={isAdmin}
                    label="Odkaz Zkušenosti v patičce"
                  />
                </div>
              </li>
              <li>
                <div
                  onClick={() => onNavigate ? onNavigate('blog') : window.location.hash = '#blog'}
                  className="hover:text-white transition-colors cursor-pointer text-left inline-block"
                >
                  <InlineText
                    value={getSiteText(siteTexts, 'footer.navBlog', 'Blog & články: Úvahy o informacích')}
                    onSave={(val) => onUpdateSiteText?.('footer.navBlog', val)}
                    isAdmin={isAdmin}
                    label="Odkaz Blog v patičce"
                  />
                </div>
              </li>
            </ul>
          </div>

          {/* Column 3: Data & Admin */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-3">
              <InlineText
                value={getSiteText(siteTexts, 'footer.adminTitle', 'Správa obsahu')}
                onSave={(val) => onUpdateSiteText?.('footer.adminTitle', val)}
                isAdmin={isAdmin}
                label="Nadpis správy obsahu v patičce"
              />
            </span>
            <div className="text-xs text-stone-400 leading-relaxed font-normal">
              <InlineText
                value={getSiteText(
                  siteTexts,
                  'footer.adminDesc',
                  'Portfolio disponuje integrovaným systémem správy dat uložených v prohlížeči.'
                )}
                onSave={(val) => onUpdateSiteText?.('footer.adminDesc', val)}
                isAdmin={isAdmin}
                multiline
                rows={2}
                label="Popis správy dat v patičce"
              />
            </div>
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={onOpenBackup}
                className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-stone-500" />
                <InlineText
                  value={getSiteText(siteTexts, 'footer.backupBtn', 'Záloha a obnovení dat (JSON)')}
                  onSave={(val) => onUpdateSiteText?.('footer.backupBtn', val)}
                  isAdmin={isAdmin}
                  label="Tlačítko zálohy v patičce"
                />
              </button>

              {!isAdmin && (
                <button
                  onClick={onOpenLogin}
                  className="text-left text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                >
                  {getSiteText(siteTexts, 'footer.loginBtn', 'Přihlásit se do režimu úprav')}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {getSiteText(siteTexts, 'footer.brand', authorName)}</span>
            <span aria-hidden="true" className="text-stone-700 font-light mx-1">|</span>
            <span>
              <InlineText
                value={getSiteText(siteTexts, 'footer.copyrightRight', 'Informační studia & digitální kurátorství')}
                onSave={(val) => onUpdateSiteText?.('footer.copyrightRight', val)}
                isAdmin={isAdmin}
                label="Pravá část copyrightu"
              />
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <InlineText
              value={getSiteText(siteTexts, 'footer.scrollTopBtn', 'Zpět nahoru')}
              onSave={(val) => onUpdateSiteText?.('footer.scrollTopBtn', val)}
              isAdmin={isAdmin}
              label="Tlačítko nahoru"
            />
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
