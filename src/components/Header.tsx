import { useState } from 'react';
import { Lock, Unlock, Menu, X, PlusCircle, Instagram } from 'lucide-react';
import { InlineText } from './InlineEdit';
import { getSiteText, type SitePalette } from '../data/portfolioData';

export type PageView = 'home' | 'study' | 'experience' | 'blog' | 'article';

interface HeaderProps {
  isAdmin: boolean;
  canManagePortfolio?: boolean;
  activeView: PageView;
  siteTexts?: Record<string, string>;
  activePalette?: SitePalette;
  onUpdateSiteText?: (key: string, value: string) => void;
  onNavigate: (view: PageView, sectionAnchor?: string) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenAddModal: (type: 'timeline' | 'course' | 'experience' | 'post') => void;
}

export function Header({
  isAdmin,
  canManagePortfolio = false,
  activeView,
  siteTexts = {},
  activePalette,
  onUpdateSiteText,
  onNavigate,
  onOpenLogin,
  onLogout,
  onOpenAddModal,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: PageView; anchor?: string; key: string; defaultLabel: string }[] = [
    { view: 'home', anchor: '#uvod', key: 'header.navHome', defaultLabel: 'Úvod & Manifest' },
    { view: 'home', anchor: '#timeline', key: 'header.navTimeline', defaultLabel: 'Časová osa' },
    { view: 'study', key: 'header.navStudy', defaultLabel: 'Studium' },
    { view: 'experience', key: 'header.navExperience', defaultLabel: 'Zkušenosti' },
    { view: 'blog', key: 'header.navBlog', defaultLabel: 'Blog' },
  ];

  const handleItemClick = (item: { view: PageView; anchor?: string }) => {
    setMobileMenuOpen(false);
    onNavigate(item.view, item.anchor);
  };

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors ${activePalette?.headerWrapper || 'bg-stone-50/90 border-stone-200/80'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand wordmark with circular emblem */}
          <div
            onClick={() => handleItemClick({ view: 'home', anchor: '#uvod' })}
            className="flex items-center gap-2.5 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer group/brand"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#34D399] shadow-2xs shrink-0 bg-[#0C1E34]">
              <img
                src="./assets/aistudio/profile_picture_c1a456ff.jpeg"
                alt="InfoStratég"
                className="w-full h-full object-cover group-hover/brand:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-base font-bold tracking-tight transition-colors leading-tight ${
                  activePalette?.isDark ? 'text-white group-hover/brand:text-[#78C0E0]' : 'text-[#0C1E34] group-hover/brand:text-[#10B981]'
                }`}
              >
                <InlineText
                  value={getSiteText(siteTexts, 'header.brand', 'InfoStratég')}
                  onSave={(val) => onUpdateSiteText?.('header.brand', val)}
                  isAdmin={isAdmin}
                  label="Název / jméno v hlavičce"
                />
              </span>
              <a
                href="https://www.instagram.com/neztrat_se_v_info"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-slate-500 hover:text-[#E1306C] font-mono tracking-wider hidden sm:block transition-colors"
                title="Přejít na Instagram @neztrat_se_v_info"
              >
                @neztrat_se_v_info
              </a>
            </div>
          </div>

          {/* Zone 2: 4-6 single-line clean navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navItems.map((item, idx) => {
              const isActive =
                (item.view === activeView || (item.view === 'blog' && activeView === 'article')) &&
                (!item.anchor || item.anchor === '#uvod' || activeView !== 'home');

              return (
                <div
                  key={idx}
                  onClick={() => handleItemClick(item)}
                  className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b cursor-pointer ${
                    isActive
                      ? (activePalette?.navActiveItem || 'text-stone-950 font-semibold border-stone-900')
                      : (activePalette?.navInactiveItem || 'text-stone-600 hover:text-stone-950 border-transparent hover:border-stone-400')
                  }`}
                >
                  <InlineText
                    value={getSiteText(siteTexts, item.key, item.defaultLabel)}
                    onSave={(val) => onUpdateSiteText?.(item.key, val)}
                    isAdmin={isAdmin}
                    label={`Položka menu: ${item.defaultLabel}`}
                  />
                </div>
              );
            })}

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/neztrat_se_v_info"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#E1306C] ${
                activePalette?.isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-[#0C1E34]'
              }`}
              title="Instagram @neztrat_se_v_info"
            >
              <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
              <span>Instagram</span>
            </a>
          </nav>

          {/* Zone 3: Primary admin action (editor only) + mobile menu toggle */}
          <div className={`flex items-center gap-3 shrink-0 ${!canManagePortfolio ? 'md:hidden' : ''}`}>
            {canManagePortfolio && (
              isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md px-2.5 py-1">
                    <InlineText
                      value={getSiteText(siteTexts, 'header.adminBadge', 'Režim úprav')}
                      onSave={(val) => onUpdateSiteText?.('header.adminBadge', val)}
                      isAdmin={isAdmin}
                      label="Označení administrace"
                    />
                  </span>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    title="Odhlásit z administrace"
                  >
                    <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                    <InlineText
                      value={getSiteText(siteTexts, 'header.logoutBtn', 'Odhlásit')}
                      onSave={(val) => onUpdateSiteText?.('header.logoutBtn', val)}
                      isAdmin={isAdmin}
                      label="Tlačítko odhlášení"
                    />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>{getSiteText(siteTexts, 'header.loginBtn', 'Správa portfolia')}</span>
                </button>
              )
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 focus:outline-hidden"
              aria-label="Přepnout menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Ribbon if Logged In */}
      {canManagePortfolio && isAdmin && (
        <div className="bg-stone-900 text-stone-200 px-4 py-2 text-xs border-t border-stone-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <span className="text-stone-400 font-mono text-[11px]">
              Admin aktivní — můžete přímo upravovat, mazat a přidávat obsah
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <button
                onClick={() => onOpenAddModal('timeline')}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs transition-colors shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3 text-emerald-400" />
                + Milník timeline
              </button>
              <button
                onClick={() => onOpenAddModal('course')}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs transition-colors shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3 text-emerald-400" />
                + Předmět
              </button>
              <button
                onClick={() => onOpenAddModal('experience')}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs transition-colors shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3 text-emerald-400" />
                + Zkušenost
              </button>
              <button
                onClick={() => onOpenAddModal('post')}
                className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded text-xs transition-colors shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-3 h-3 text-emerald-400" />
                + Článek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-stone-50 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleItemClick(item)}
              className="block w-full text-left px-3 py-2 text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
            >
              {siteTexts[item.key] || item.defaultLabel}
            </button>
          ))}
          <a
            href="https://www.instagram.com/neztrat_se_v_info"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-base font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />
            <span>Instagram (@neztrat_se_v_info)</span>
          </a>
        </div>
      )}
    </header>
  );
}
