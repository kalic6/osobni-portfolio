import { useState } from 'react';
import { ArrowDown, Edit3, Compass, CheckCircle2, Plus, Trash2, Sparkles, Brain, ShieldCheck, Palette, Check, Instagram } from 'lucide-react';
import {
  type ManifestData,
  type ManifestPoint,
  type AiPrinciple,
  type SitePalette,
  defaultAiPrinciples,
  SITE_PALETTES,
  getSiteText,
} from '../data/portfolioData';
import { InlineText, InlineImage } from './InlineEdit';
import { useConfirm } from './ConfirmModal';

interface HeroManifestProps {
  manifest: ManifestData;
  siteTexts?: Record<string, string>;
  onUpdateSiteText?: (key: string, value: string) => void;
  isAdmin: boolean;
  onEditManifest: () => void;
  onUpdateManifest: (updated: Partial<ManifestData>) => void;
}

export function HeroManifest({
  manifest,
  siteTexts = {},
  onUpdateSiteText,
  isAdmin,
  onEditManifest,
  onUpdateManifest,
}: HeroManifestProps) {
  const { requestConfirm } = useConfirm();
  const [showFullManifest, setShowFullManifest] = useState(false);

  const aiPrinciplesList = manifest.aiPrinciples && manifest.aiPrinciples.length > 0
    ? manifest.aiPrinciples
    : defaultAiPrinciples;

  // Helper to add a paragraph to fullManifestText
  const handleAddParagraph = () => {
    const updated = [...manifest.fullManifestText, 'Nový odstavec osobního manifestu...'];
    onUpdateManifest({ fullManifestText: updated });
    setShowFullManifest(true);
  };

  // Helper to add a pillar
  const handleAddPillar = () => {
    const newPillar: ManifestPoint = {
      id: `p-${Date.now()}`,
      title: 'Nový pilíř přístupu',
      description: 'Stručný popis hodnotového principu...',
      iconName: 'Compass',
    };
    onUpdateManifest({ manifestPillars: [...manifest.manifestPillars, newPillar] });
  };

  // Helper to add an AI principle
  const handleAddAiPrinciple = () => {
    const newPrinciple: AiPrinciple = {
      id: `ai-${Date.now()}`,
      category: 'Nová zásada',
      title: 'Nová zásada pro práci s AI',
      description: 'Zde popište své pravidlo pro práci s generativní umělou inteligencí...',
    };
    onUpdateManifest({ aiPrinciples: [...aiPrinciplesList, newPrinciple] });
  };

  return (
    <section id="uvod" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin floating button & Mode hint */}
        {isAdmin && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold">Režim přímých úprav aktivní:</span>
              <span>Klikněte přímo na jakýkoliv text níže a začněte psát. Změny se ukládají automaticky.</span>
            </div>
            <button
              onClick={onEditManifest}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-md text-xs font-medium transition-colors shadow-xs cursor-pointer ml-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Komplexní formulář manifestu</span>
            </button>
          </div>
        )}

        {/* 2-Column Balanced Hero Split (Mobile: Profile emblem above text) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typographic hierarchy */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            
            {/* Editorial kicker */}
            <div className="flex items-center gap-3 text-xs tracking-wider text-stone-500 uppercase font-semibold">
              <InlineText
                value={getSiteText(siteTexts, 'hero.kickerLeft', 'Osobní manifest & portfolio')}
                onSave={(val) => onUpdateSiteText?.('hero.kickerLeft', val)}
                isAdmin={isAdmin}
                label="Kategorie / Kicker vlevo"
              />
              <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
              <InlineText
                value={getSiteText(siteTexts, 'hero.kickerRight', 'Informační gramotnost')}
                onSave={(val) => onUpdateSiteText?.('hero.kickerRight', val)}
                isAdmin={isAdmin}
                label="Kategorie / Kicker vpravo"
              />
            </div>

            {/* Hero Headline (Click-to-edit) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15] text-balance">
              <InlineText
                value={manifest.heroHeadline}
                onSave={(val) => onUpdateManifest({ heroHeadline: val })}
                isAdmin={isAdmin}
                label="Hlavní titulek"
                multiline
                rows={2}
              />
            </h1>

            {/* Subheading (Click-to-edit) */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-normal">
              <InlineText
                value={manifest.heroSubhead}
                onSave={(val) => onUpdateManifest({ heroSubhead: val })}
                isAdmin={isAdmin}
                label="Podtitulek manifestu"
                multiline
                rows={3}
              />
            </p>

            {/* Pullquote Box */}
            <div className="p-6 bg-stone-100/80 rounded-2xl border border-stone-200/90 relative">
              <blockquote className="italic text-stone-800 text-lg sm:text-xl leading-relaxed">
                <span className="select-none">„</span>
                <InlineText
                  value={manifest.manifestQuote.replace(/^["„“”\s]+/, '').replace(/["„“”\s]+$/, '')}
                  onSave={(val) =>
                    onUpdateManifest({
                      manifestQuote: val.replace(/^["„“”\s]+/, '').replace(/["„“”\s]+$/, ''),
                    })
                  }
                  isAdmin={isAdmin}
                  label="Citace v rámečku"
                  as="span"
                  multiline
                  rows={2}
                />
                <span className="select-none">“</span>
              </blockquote>
              <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                <span className="font-medium text-stone-700">
                  <InlineText
                    value={manifest.manifestQuoteAuthor}
                    onSave={(val) => onUpdateManifest({ manifestQuoteAuthor: val })}
                    isAdmin={isAdmin}
                    label="Autor citace"
                  />
                </span>
                <span className="text-stone-500">
                  <InlineText
                    value={getSiteText(siteTexts, 'hero.quoteOrigin', 'Východisko mé práce')}
                    onSave={(val) => onUpdateSiteText?.('hero.quoteOrigin', val)}
                    isAdmin={isAdmin}
                    label="Popisek citace"
                  />
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#timeline"
                onClick={(e) => {
                  if (isAdmin) return;
                  e.preventDefault();
                  document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 transition-colors shadow-xs"
              >
                <InlineText
                  value={getSiteText(siteTexts, 'hero.timelineBtn', 'Prozkoumat časovou osu')}
                  onSave={(val) => onUpdateSiteText?.('hero.timelineBtn', val)}
                  isAdmin={isAdmin}
                  label="Text tlačítka časové osy"
                />
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowFullManifest(!showFullManifest)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-sm font-medium hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4 text-stone-600" />
                <InlineText
                  value={
                    showFullManifest
                      ? getSiteText(siteTexts, 'hero.manifestBtnHide', 'Skrýt detailní manifest')
                      : getSiteText(siteTexts, 'hero.manifestBtnRead', 'Přečíst celý manifest')
                  }
                  onSave={(val) =>
                    onUpdateSiteText?.(
                      showFullManifest ? 'hero.manifestBtnHide' : 'hero.manifestBtnRead',
                      val
                    )
                  }
                  isAdmin={isAdmin}
                  label="Tlačítko manifestu"
                />
              </button>
            </div>
          </div>

          {/* Right Column: High-tech Brand Emblem with Instagram click (Mobile: Shown first) */}
          <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
              {/* Subtle ambient brand glow matching moodboard */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#34D399]/25 via-[#78C0E0]/20 to-[#F05423]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative aspect-square rounded-full p-2 bg-gradient-to-b from-[#34D399] via-[#78C0E0] to-[#0C1E34] shadow-2xl group/emblem">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0A192F] relative border-2 border-[#0A192F]">
                  {isAdmin ? (
                    <InlineImage
                      src={manifest.photoUrl}
                      alt={manifest.photoAlt}
                      onSave={(newUrl) => onUpdateManifest({ photoUrl: newUrl })}
                      isAdmin={isAdmin}
                      aspectClass="aspect-square"
                    />
                  ) : (
                    <a
                      href="https://www.instagram.com/neztrat_se_v_info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full relative group/link cursor-pointer"
                      title="Otevřít profil @neztrat_se_v_info na Instagramu"
                    >
                      <InlineImage
                        src={manifest.photoUrl}
                        alt={manifest.photoAlt}
                        onSave={(newUrl) => onUpdateManifest({ photoUrl: newUrl })}
                        isAdmin={isAdmin}
                        aspectClass="aspect-square"
                      />
                      {/* Hover Overlay with Instagram CTA */}
                      <div className="absolute inset-0 z-10 rounded-full flex flex-col items-center justify-center bg-[#0C1E34]/0 group-hover/link:bg-[#0C1E34]/75 transition-all duration-300 opacity-0 group-hover/link:opacity-100 text-white p-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center shadow-lg transform scale-90 group-hover/link:scale-100 transition-transform">
                          <Instagram className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold mt-2 tracking-wide text-white drop-shadow-md text-center">
                          @neztrat_se_v_info
                        </span>
                        <span className="text-[11px] text-[#34D399] font-medium drop-shadow flex items-center gap-1 mt-0.5">
                          Přejít na Instagram ↗
                        </span>
                      </div>
                    </a>
                  )}
                </div>

                {/* Floating Instagram Corner Pill Badge */}
                <a
                  href="https://www.instagram.com/neztrat_se_v_info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C1E34] hover:bg-[#16365C] text-white border-2 border-[#34D399] shadow-lg text-xs font-semibold hover:scale-105 transition-all cursor-pointer"
                  title="Sledovat @neztrat_se_v_info na Instagramu"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#E1306C] shrink-0" />
                  <span className="text-[11px] font-mono">@neztrat_se_v_info</span>
                </a>
              </div>

              {/* Minimalist Caption (Click-to-edit name & location) */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-2">
                <span className="font-bold text-[#0C1E34] tracking-wide">
                  <InlineText
                    value={manifest.authorName}
                    onSave={(val) => onUpdateManifest({ authorName: val })}
                    isAdmin={isAdmin}
                    label="Jméno / Brand"
                  />
                </span>
                <span className="font-mono text-[11px] text-[#0C1E34]/80">
                  <InlineText
                    value={manifest.authorLocation}
                    onSave={(val) => onUpdateManifest({ authorLocation: val })}
                    isAdmin={isAdmin}
                    label="Lokalita"
                  />
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Expandable Full Manifest Text */}
        {showFullManifest && (
          <div className="mt-12 p-8 sm:p-10 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold tracking-tight text-stone-900">
                <InlineText
                  value={getSiteText(siteTexts, 'hero.modalManifestTitle', 'Manifest informační gramotnosti pro 21. století')}
                  onSave={(val) => onUpdateSiteText?.('hero.modalManifestTitle', val)}
                  isAdmin={isAdmin}
                  label="Nadpis manifestu"
                />
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <InlineText
                    value={getSiteText(siteTexts, 'hero.modalAuthorPrefix', 'Autorka:')}
                    onSave={(val) => onUpdateSiteText?.('hero.modalAuthorPrefix', val)}
                    isAdmin={isAdmin}
                    label="Označení autora"
                  />
                  <span>{manifest.authorName}</span>
                </span>
                {isAdmin && (
                  <button
                    onClick={handleAddParagraph}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{getSiteText(siteTexts, 'hero.addParagraphBtn', 'Přidat odstavec')}</span>
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-4 text-stone-700 text-base leading-relaxed">
              {manifest.fullManifestText.map((paragraph, idx) => (
                <div key={idx} className="relative group/p flex items-start justify-between gap-3 p-2 -mx-2 rounded-xl hover:bg-stone-50/80 transition-colors">
                  <div className="flex-1">
                    <InlineText
                      value={paragraph}
                      onSave={(newP) => {
                        const updated = [...manifest.fullManifestText];
                        updated[idx] = newP;
                        onUpdateManifest({ fullManifestText: updated });
                      }}
                      onDelete={() => {
                        const updated = manifest.fullManifestText.filter((_, i) => i !== idx);
                        onUpdateManifest({ fullManifestText: updated });
                      }}
                      deleteConfirmPrompt="Opravdu chcete tento odstavec z manifestu smazat?"
                      isAdmin={isAdmin}
                      as="p"
                      multiline
                      rows={3}
                    />
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        requestConfirm({
                          title: 'Smazat odstavec',
                          message: `Opravdu chcete smazat odstavec č. ${idx + 1} z osobního manifestu?`,
                          onConfirm: () => {
                            const updated = manifest.fullManifestText.filter((_, i) => i !== idx);
                            onUpdateManifest({ fullManifestText: updated });
                          },
                        });
                      }}
                      title="Smazat tento odstavec"
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full-width strip: 4 Pillars of Information Literacy (NOW HIGHLIGHTED CONTAINER) */}
        {(() => {
          const activePaletteId = getSiteText(
            siteTexts,
            'site.colorPalette',
            getSiteText(siteTexts, 'aiPrinciples.colorPalette', 'warm-parchment')
          );
          const activePalette: SitePalette =
            SITE_PALETTES.find((p) => p.id === activePaletteId) || SITE_PALETTES[0];

          return (
            <>
              {/* Highlighted Container for 4 Pillars */}
              <div className={`mt-20 sm:mt-24 relative rounded-3xl p-8 sm:p-12 overflow-hidden transition-all duration-300 ${activePalette.highlightContainer}`}>
                {/* Ambient decorative glowing backdrops */}
                <div className={`absolute -top-28 -right-28 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${activePalette.highlightGlowTopRight}`} />
                <div className={`absolute -bottom-28 -left-28 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${activePalette.highlightGlowBottomLeft}`} />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-stone-200/60 dark:border-stone-800/80">
                    <div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 ${activePalette.highlightKicker}`}>
                        <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activePalette.highlightKickerIcon}`} />
                        <InlineText
                          value={getSiteText(siteTexts, 'hero.pillarsKickerLeft', 'Základní filozofie')}
                          onSave={(val) => onUpdateSiteText?.('hero.pillarsKickerLeft', val)}
                          isAdmin={isAdmin}
                          label="Kategorie vlevo"
                        />
                        <span aria-hidden="true" className={`${activePalette.highlightKickerDot} font-light mx-1`}>|</span>
                        <InlineText
                          value={getSiteText(siteTexts, 'hero.pillarsKickerRight', 'Informační gramotnost')}
                          onSave={(val) => onUpdateSiteText?.('hero.pillarsKickerRight', val)}
                          isAdmin={isAdmin}
                          label="Kategorie vpravo"
                        />
                      </div>
                      <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${activePalette.highlightTitle}`}>
                        <InlineText
                          value={getSiteText(siteTexts, 'hero.pillarsTitle', 'Čtyři pilíře mého přístupu k informacím')}
                          onSave={(val) => onUpdateSiteText?.('hero.pillarsTitle', val)}
                          isAdmin={isAdmin}
                          label="Nadpis pilířů"
                        />
                      </h2>
                      <div className={`text-sm sm:text-base mt-2 max-w-3xl leading-relaxed font-light ${activePalette.highlightSubtitle}`}>
                        <InlineText
                          value={getSiteText(
                            siteTexts,
                            'hero.pillarsSubtitle',
                            'Hodnotové principy, které provází mé studium, výzkum, lektorování i vizi do budoucna.'
                          )}
                          onSave={(val) => onUpdateSiteText?.('hero.pillarsSubtitle', val)}
                          isAdmin={isAdmin}
                          multiline
                          rows={2}
                          label="Podtitul pilířů"
                        />
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={handleAddPillar}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${activePalette.highlightAdminBtn}`}
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>{getSiteText(siteTexts, 'hero.addPillarBtn', 'Přidat pilíř')}</span>
                      </button>
                    )}
                  </div>

                  <div
                    className={`w-full grid gap-6 ${
                      manifest.manifestPillars.length === 1
                        ? 'grid-cols-1'
                        : manifest.manifestPillars.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : manifest.manifestPillars.length === 3
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    }`}
                  >
                    {manifest.manifestPillars.map((pillar, idx) => (
                      <div
                        key={pillar.id}
                        className={`group/pillar relative rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${activePalette.pillarCard}`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className={activePalette.pillarNumber}>
                              0{idx + 1}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  requestConfirm({
                                    title: 'Smazat pilíř',
                                    message: `Opravdu chcete smazat pilíř "${pillar.title}"?`,
                                    onConfirm: () => {
                                      onUpdateManifest({
                                        manifestPillars: manifest.manifestPillars.filter(
                                          (p) => p.id !== pillar.id
                                        ),
                                      });
                                    },
                                  });
                                }}
                                title="Smazat tento pilíř"
                                className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className={`h-0.5 w-10 my-3 rounded-full ${activePalette.pillarDivider}`} />

                          <h3 className={`text-base sm:text-lg font-serif font-bold mb-2 leading-snug ${activePalette.pillarTitle}`}>
                            <InlineText
                              value={pillar.title}
                              onSave={(val) => {
                                const updated = manifest.manifestPillars.map((p) =>
                                  p.id === pillar.id ? { ...p, title: val } : p
                                );
                                onUpdateManifest({ manifestPillars: updated });
                              }}
                              onDelete={() => {
                                onUpdateManifest({
                                  manifestPillars: manifest.manifestPillars.filter(
                                    (p) => p.id !== pillar.id
                                  ),
                                });
                              }}
                              deleteConfirmPrompt={`Opravdu chcete smazat pilíř "${pillar.title}"?`}
                              isAdmin={isAdmin}
                              label="Název pilíře"
                            />
                          </h3>

                          <div className={`text-xs sm:text-sm leading-relaxed font-normal ${activePalette.pillarDesc}`}>
                            <InlineText
                              value={pillar.description}
                              onSave={(val) => {
                                const updated = manifest.manifestPillars.map((p) =>
                                  p.id === pillar.id ? { ...p, description: val } : p
                                );
                                onUpdateManifest({ manifestPillars: updated });
                              }}
                              onDelete={() => {
                                onUpdateManifest({
                                  manifestPillars: manifest.manifestPillars.filter(
                                    (p) => p.id !== pillar.id
                                  ),
                                });
                              }}
                              deleteConfirmPrompt={`Opravdu chcete smazat pilíř "${pillar.title}"?`}
                              isAdmin={isAdmin}
                              multiline
                              rows={3}
                              label="Popis pilíře"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Open section: Mé zásady při práci s umělou inteligencí */}
              <div className="mt-16 sm:mt-20 pt-12 border-t border-stone-200/90 dark:border-stone-800">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                  <div>
                    <div className={`flex items-center gap-2 text-xs tracking-wider uppercase mb-2 ${activePalette.aiSectionKicker}`}>
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <InlineText
                        value={getSiteText(siteTexts, 'aiPrinciples.kickerLeft', 'Etika & Technologie')}
                        onSave={(val) => onUpdateSiteText?.('aiPrinciples.kickerLeft', val)}
                        isAdmin={isAdmin}
                        label="Kategorie vlevo"
                      />
                      <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                      <InlineText
                        value={getSiteText(siteTexts, 'aiPrinciples.kickerRight', 'Odpovědný přístup')}
                        onSave={(val) => onUpdateSiteText?.('aiPrinciples.kickerRight', val)}
                        isAdmin={isAdmin}
                        label="Kategorie vpravo"
                      />
                    </div>
                    <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${activePalette.aiSectionTitle}`}>
                      <InlineText
                        value={getSiteText(siteTexts, 'aiPrinciples.title', 'Mé zásady při práci s umělou inteligencí')}
                        onSave={(val) => onUpdateSiteText?.('aiPrinciples.title', val)}
                        isAdmin={isAdmin}
                        label="Hlavní nadpis sekce AI zásad"
                      />
                    </h2>
                    <div className={`text-sm mt-1 max-w-3xl font-normal leading-relaxed ${activePalette.aiSectionSubtitle}`}>
                      <InlineText
                        value={getSiteText(
                          siteTexts,
                          'aiPrinciples.subtitle',
                          'Jako informační specialistka vnímám generativní AI jako silný nástroj pro rozšíření lidského potenciálu, který však vyžaduje nekompromisní etické mantinely, ověřování faktů a zachování autonomního lidského úsudku.'
                        )}
                        onSave={(val) => onUpdateSiteText?.('aiPrinciples.subtitle', val)}
                        isAdmin={isAdmin}
                        multiline
                        rows={2}
                        label="Podtitulek sekce AI zásad"
                      />
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={handleAddAiPrinciple}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${activePalette.aiSectionAdminBtn}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{getSiteText(siteTexts, 'aiPrinciples.addBtn', 'Přidat zásadu')}</span>
                    </button>
                  )}
                </div>

                <div
                  className={`w-full grid gap-6 ${
                    aiPrinciplesList.length === 1
                      ? 'grid-cols-1'
                      : aiPrinciplesList.length === 2
                      ? 'grid-cols-1 sm:grid-cols-2'
                      : aiPrinciplesList.length === 3
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  }`}
                >
                  {aiPrinciplesList.map((principle, idx) => (
                    <div
                      key={principle.id}
                      className={`p-6 sm:p-7 rounded-2xl transition-all duration-300 flex flex-col justify-between group/ai relative hover:-translate-y-1 ${activePalette.aiCard}`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${activePalette.aiRuleTag}`}>
                            <Sparkles className={`w-3.5 h-3.5 ${activePalette.aiRuleIcon}`} />
                            <span>0{idx + 1}</span>
                          </span>

                          {isAdmin && (
                            <button
                              onClick={() => {
                                requestConfirm({
                                  title: 'Smazat zásadu',
                                  message: `Opravdu chcete smazat zásadu "${principle.title}"?`,
                                  onConfirm: () => {
                                    onUpdateManifest({
                                      aiPrinciples: aiPrinciplesList.filter((p) => p.id !== principle.id),
                                    });
                                  },
                                });
                              }}
                              title="Smazat tuto zásadu"
                              className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <h3 className={`text-base sm:text-lg font-bold mb-2 leading-snug ${activePalette.aiCardTitle}`}>
                          <InlineText
                            value={principle.title}
                            onSave={(val) => {
                              const updated = aiPrinciplesList.map((p) =>
                                p.id === principle.id ? { ...p, title: val } : p
                              );
                              onUpdateManifest({ aiPrinciples: updated });
                            }}
                            onDelete={() => {
                              onUpdateManifest({
                                aiPrinciples: aiPrinciplesList.filter((p) => p.id !== principle.id),
                              });
                            }}
                            deleteConfirmPrompt={`Opravdu chcete smazat zásadu "${principle.title}"?`}
                            isAdmin={isAdmin}
                            label="Název zásady"
                          />
                        </h3>

                        <div className={`text-xs sm:text-sm leading-relaxed font-normal ${activePalette.aiCardDesc}`}>
                          <InlineText
                            value={principle.description}
                            onSave={(val) => {
                              const updated = aiPrinciplesList.map((p) =>
                                p.id === principle.id ? { ...p, description: val } : p
                              );
                              onUpdateManifest({ aiPrinciples: updated });
                            }}
                            onDelete={() => {
                              onUpdateManifest({
                                aiPrinciples: aiPrinciplesList.filter((p) => p.id !== principle.id),
                              });
                            }}
                            deleteConfirmPrompt={`Opravdu chcete smazat zásadu "${principle.title}"?`}
                            isAdmin={isAdmin}
                            multiline
                            rows={3}
                            label="Popis zásady"
                          />
                        </div>
                      </div>

                      <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] ${activePalette.aiCardFooter}`}>
                        <span className="flex items-center gap-1.5 opacity-80">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>AI etika</span>
                        </span>
                        <span className="font-mono text-[10px] opacity-75">kodex #{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}

      </div>
    </section>
  );
}
