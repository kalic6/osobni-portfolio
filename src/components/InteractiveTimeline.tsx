import { useState, useEffect } from 'react';
import {
  Sparkles,
  History,
  Compass,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Building,
  X,
} from 'lucide-react';
import {
  type TimelineItem,
  type TimelinePhase,
  sortTimelineItems,
  getSiteText,
} from '../data/portfolioData';
import { InlineText } from './InlineEdit';

interface InteractiveTimelineProps {
  items: TimelineItem[];
  siteTexts?: Record<string, string>;
  onUpdateSiteText?: (key: string, value: string) => void;
  isAdmin: boolean;
  onAddItem: () => void;
  onEditItem: (item: TimelineItem) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItem?: (id: string, updatedFields: Partial<TimelineItem>) => void;
  onMoveItem?: (id: string, direction: 'up' | 'down') => void;
  onInsertItemAt?: (insertIndex: number, phase: TimelinePhase) => void;
}

export function InteractiveTimeline({
  items,
  siteTexts = {},
  onUpdateSiteText,
  isAdmin,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onUpdateItem,
  onMoveItem,
  onInsertItemAt,
}: InteractiveTimelineProps) {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [activePhase, setActivePhase] = useState<TimelinePhase>('past');

  // Guarantee strict phase order: 1. past (Odkud jdu) -> 2. present (Kde jsem) -> 3. future (Kam směřuji)
  const sortedAllItems = sortTimelineItems(items);

  // Track which phase is currently in view while scrolling through the timeline
  useEffect(() => {
    const phases: TimelinePhase[] = ['past', 'present', 'future'];
    const handleScroll = () => {
      const offset = isAdmin ? 210 : 165;
      let current: TimelinePhase = 'past';
      for (const phase of phases) {
        const el = document.getElementById(`timeline-phase-${phase}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            current = phase;
          }
        }
      }
      setActivePhase(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdmin, sortedAllItems.length]);

  const scrollToPhase = (phase: TimelinePhase) => {
    setActivePhase(phase);
    const el = document.getElementById(`timeline-phase-${phase}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPhaseIcon = (phase: TimelinePhase) => {
    switch (phase) {
      case 'past':
        return <History className="w-4 h-4 text-stone-600" />;
      case 'present':
        return <Compass className="w-4 h-4 text-slate-900" />;
      case 'future':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getPhaseLabel = (phase: TimelinePhase) => {
    switch (phase) {
      case 'past':
        return getSiteText(siteTexts, 'timeline.filterPast', 'Odkud jdu');
      case 'present':
        return getSiteText(siteTexts, 'timeline.filterPresent', 'Kde jsem');
      case 'future':
        return getSiteText(siteTexts, 'timeline.filterFuture', 'Kam směřuji');
    }
  };

  const getPhaseCardStyles = (phase: TimelinePhase) => {
    switch (phase) {
      case 'past':
        return {
          card: 'bg-[#FAF8F5] border-stone-300 hover:border-stone-500 hover:bg-white text-stone-900 shadow-2xs hover:shadow-xs border-l-4 border-l-stone-400',
          pill: 'bg-stone-200/90 text-stone-800 border-stone-300',
          node: 'border-stone-500 bg-stone-100 text-stone-700',
        };
      case 'present':
        return {
          card: 'bg-white border-[#D5E2EC] hover:border-[#0C1E34] hover:shadow-sm text-[#0C1E34] shadow-2xs ring-1 ring-slate-200/60 border-l-4 border-l-[#0C1E34]',
          pill: 'bg-[#0C1E34] text-white border-[#0C1E34]',
          node: 'border-[#0C1E34] bg-white text-[#0C1E34] shadow-xs ring-2 ring-slate-100',
        };
      case 'future':
        return {
          card: 'bg-white border-emerald-300 hover:border-emerald-500 hover:shadow-sm text-[#0C1E34] shadow-2xs ring-1 ring-emerald-100 border-l-4 border-l-[#10B981]',
          pill: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          node: 'border-emerald-500 bg-emerald-50 text-emerald-600 ring-2 ring-emerald-50',
        };
    }
  };

  return (
    <section
      id="timeline"
      className={`py-16 md:py-24 bg-stone-100/60 border-t border-stone-200 ${
        isAdmin ? 'scroll-mt-28' : 'scroll-mt-16'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-wider text-stone-500 uppercase font-semibold mb-2">
              <InlineText
                value={getSiteText(siteTexts, 'timeline.kickerLeft', 'Interaktivní časová osa')}
                onSave={(val) => onUpdateSiteText?.('timeline.kickerLeft', val)}
                isAdmin={isAdmin}
                label="Kategorie vlevo"
              />
              <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
              <InlineText
                value={getSiteText(siteTexts, 'timeline.kickerRight', 'Cesta & Plány')}
                onSave={(val) => onUpdateSiteText?.('timeline.kickerRight', val)}
                isAdmin={isAdmin}
                label="Kategorie vpravo"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif">
              <InlineText
                value={getSiteText(siteTexts, 'timeline.title', 'Odkud jdu, kde jsem a kam směřuji')}
                onSave={(val) => onUpdateSiteText?.('timeline.title', val)}
                isAdmin={isAdmin}
                label="Hlavní nadpis časové osy"
              />
            </h2>
            <div className="mt-2 text-base text-stone-600 max-w-2xl font-normal">
              <InlineText
                value={getSiteText(
                  siteTexts,
                  'timeline.subtitle',
                  'Proklikejte se jednotlivými etapami mé profesní i osobní cesty – od prvních rešerší po dlouhodobé vize vzdělávání v éře AI.'
                )}
                onSave={(val) => onUpdateSiteText?.('timeline.subtitle', val)}
                isAdmin={isAdmin}
                multiline
                rows={2}
                label="Podtitulek časové osy"
              />
            </div>
          </div>

          {/* Admin Add Button */}
          {isAdmin && (
            <button
              onClick={onAddItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{getSiteText(siteTexts, 'timeline.addBtn', 'Přidat nový milník')}</span>
            </button>
          )}
        </div>

        {/* Sticky Phase Quick Scroll Navigation (Pins while scrolling along the timeline) */}
        <div
          className={`sticky z-30 mb-10 flex justify-start transition-all ${
            isAdmin ? 'top-[7rem]' : 'top-[4.5rem]'
          }`}
        >
          <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-stone-200/85 backdrop-blur-md border border-stone-300/80 rounded-2xl shadow-md">
            <button
              type="button"
              onClick={() => scrollToPhase('past')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activePhase === 'past'
                  ? 'bg-stone-800 text-white shadow-xs'
                  : 'bg-white/85 hover:bg-white text-stone-800 hover:shadow-xs'
              }`}
              title="Přejít na etapu Odkud jdu"
            >
              <History className={`w-3.5 h-3.5 ${activePhase === 'past' ? 'text-stone-200' : 'text-stone-600'}`} />
              <InlineText
                value={getSiteText(siteTexts, 'timeline.filterPast', 'Odkud jdu')}
                onSave={(val) => onUpdateSiteText?.('timeline.filterPast', val)}
                isAdmin={isAdmin}
                label="Záložka: Odkud jdu"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollToPhase('present')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activePhase === 'present'
                  ? 'bg-[#0C1E34] text-white shadow-xs'
                  : 'bg-white/85 hover:bg-white text-slate-900 hover:shadow-xs'
              }`}
              title="Přejít na etapu Kde jsem"
            >
              <Compass className={`w-3.5 h-3.5 ${activePhase === 'present' ? 'text-sky-300' : 'text-slate-800'}`} />
              <InlineText
                value={getSiteText(siteTexts, 'timeline.filterPresent', 'Kde jsem')}
                onSave={(val) => onUpdateSiteText?.('timeline.filterPresent', val)}
                isAdmin={isAdmin}
                label="Záložka: Kde jsem"
              />
            </button>
            <button
              type="button"
              onClick={() => scrollToPhase('future')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activePhase === 'future'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white/85 hover:bg-white text-emerald-950 hover:shadow-xs'
              }`}
              title="Přejít na etapu Kam směřuji"
            >
              <Sparkles className={`w-3.5 h-3.5 ${activePhase === 'future' ? 'text-emerald-200' : 'text-emerald-600'}`} />
              <InlineText
                value={getSiteText(siteTexts, 'timeline.filterFuture', 'Kam směřuji')}
                onSave={(val) => onUpdateSiteText?.('timeline.filterFuture', val)}
                isAdmin={isAdmin}
                label="Záložka: Kam směřuji"
              />
            </button>
          </div>
        </div>

        {/* Timeline Flow */}
        <div className="relative">
          {/* Subtle vertical center spine on large screens */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-px bg-stone-300 -translate-x-1/2" />

          {/* Top insert milestone button for admin */}
          {isAdmin && (
            <div className="flex items-center justify-center mb-6">
              <button
                type="button"
                onClick={() => onInsertItemAt?.(0, 'past')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-stone-900 text-stone-700 hover:text-white rounded-full text-xs font-semibold border border-stone-300 hover:border-transparent shadow-2xs transition-all cursor-pointer"
                title="Vložit nový milník na samotný začátek časové osy"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Vložit milník na začátek</span>
              </button>
            </div>
          )}

          <div className="space-y-8 lg:space-y-10">
            {sortedAllItems.map((item, index) => {
              const isEven = index % 2 === 0;
              const isFirst = index === 0;
              const isLast = index === sortedAllItems.length - 1;
              const isPhaseTransition =
                index === 0 || item.phase !== sortedAllItems[index - 1]?.phase;
              const cardStyle = getPhaseCardStyles(item.phase);

              return (
                <div key={item.id} className="space-y-6">
                  {/* Phase Section Divider with scroll anchor */}
                  {isPhaseTransition && (
                    <div
                      id={`timeline-phase-${item.phase}`}
                      className={`relative flex items-center justify-center my-8 pt-4 z-20 ${
                        isAdmin ? 'scroll-mt-44' : 'scroll-mt-36'
                      }`}
                    >
                      <div
                        className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold shadow-xs border ${
                          item.phase === 'past'
                            ? 'bg-stone-200 text-stone-800 border-stone-300'
                            : item.phase === 'present'
                            ? 'bg-slate-900 text-white border-slate-800 shadow-sm'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {getPhaseIcon(item.phase)}
                        <span className="uppercase tracking-wider font-semibold">
                          {getPhaseLabel(item.phase)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative flex flex-col lg:flex-row items-center gap-6 ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Central Node Indicator with Phase Styling */}
                    <div
                      className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 items-center justify-center z-10 shadow-xs ${cardStyle.node}`}
                    >
                      {getPhaseIcon(item.phase)}
                    </div>

                    {/* Content Card with Distinct Phase Colors */}
                    <div className="w-full lg:w-1/2 px-0 lg:px-6">
                      <div
                        onClick={() => setSelectedItem(item)}
                        className={`p-6 sm:p-7 rounded-2xl border transition-all cursor-pointer group relative ${cardStyle.card}`}
                      >
                        {/* Card Header & Admin Controls */}
                        <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cardStyle.pill}`}>
                              {item.phaseLabel || getPhaseLabel(item.phase)}
                            </span>
                            <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                            <span className="inline-flex items-center gap-1 text-stone-600">
                              <Calendar className="w-3 h-3 text-stone-400" />
                              <InlineText
                                value={item.timePeriod}
                                onSave={(val) => onUpdateItem?.(item.id, { timePeriod: val })}
                                isAdmin={isAdmin}
                                label="Časové období"
                              />
                            </span>
                          </div>

                          {/* Admin reordering and item management controls */}
                          {isAdmin && (
                            <div
                              className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-lg border border-stone-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => onMoveItem?.(item.id, 'up')}
                                className={`p-1 rounded transition-colors ${
                                  isFirst
                                    ? 'text-stone-300 cursor-not-allowed'
                                    : 'text-stone-700 hover:text-stone-950 hover:bg-white cursor-pointer'
                                }`}
                                title="Posunout milník výše / dříve na časové ose"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => onMoveItem?.(item.id, 'down')}
                                className={`p-1 rounded transition-colors ${
                                  isLast
                                    ? 'text-stone-300 cursor-not-allowed'
                                    : 'text-stone-700 hover:text-stone-950 hover:bg-white cursor-pointer'
                                }`}
                                title="Posunout milník níže / později na časové ose"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <div className="w-px h-3.5 bg-stone-300 mx-0.5" />
                              <button
                                type="button"
                                onClick={() => onEditItem(item)}
                                className="p-1 hover:bg-white rounded text-stone-700 hover:text-stone-950 cursor-pointer"
                                title="Upravit celý milník formulářem"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteItem(item.id)}
                                className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 cursor-pointer"
                                title="Smazat milník"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors font-serif">
                          <InlineText
                            value={item.title}
                            onSave={(val) => onUpdateItem?.(item.id, { title: val })}
                            isAdmin={isAdmin}
                            label="Název milníku"
                          />
                        </h3>

                        {/* Subtitle */}
                        <div className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                          <InlineText
                            value={item.subtitle}
                            onSave={(val) => onUpdateItem?.(item.id, { subtitle: val })}
                            isAdmin={isAdmin}
                            label="Podtitulek milníku"
                          />
                        </div>

                        {/* Organization & Location */}
                        {(item.organization || item.location || isAdmin) && (
                          <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 flex-wrap">
                            {(item.organization || isAdmin) && (
                              <span className="flex items-center gap-1">
                                <Building className="w-3 h-3 text-stone-400" />
                                <InlineText
                                  value={item.organization || ''}
                                  onSave={(val) => onUpdateItem?.(item.id, { organization: val })}
                                  isAdmin={isAdmin}
                                  placeholder="Přidat organizaci..."
                                  label="Organizace"
                                />
                              </span>
                            )}
                            {(item.location || isAdmin) && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                <InlineText
                                  value={item.location || ''}
                                  onSave={(val) => onUpdateItem?.(item.id, { location: val })}
                                  isAdmin={isAdmin}
                                  placeholder="Přidat lokaci..."
                                  label="Lokalita"
                                />
                              </span>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        <div className="mt-3 text-sm text-stone-600 leading-relaxed font-normal">
                          <InlineText
                            value={item.description}
                            onSave={(val) => onUpdateItem?.(item.id, { description: val })}
                            isAdmin={isAdmin}
                            multiline
                            rows={3}
                            label="Popis milníku"
                          />
                        </div>

                        {/* Reflection pull */}
                        {(item.personalReflection || isAdmin) && (
                          <div className="mt-4 pt-3 border-t border-stone-100">
                            <div className="italic text-xs text-stone-700">
                              „
                              <InlineText
                                value={item.personalReflection || ''}
                                onSave={(val) => onUpdateItem?.(item.id, { personalReflection: val })}
                                isAdmin={isAdmin}
                                multiline
                                rows={2}
                                placeholder="Klikněte pro přidání osobní reflexe..."
                                label="Osobní reflexe"
                              />
                              “
                            </div>
                          </div>
                        )}

                        {/* Interactive affordance */}
                        <div className="mt-4 flex items-center justify-between pt-2">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500">
                            {item.tags.slice(0, 3).map((tag, tIdx) => (
                              <span key={tIdx}>#{tag}</span>
                            ))}
                          </div>

                          <span className="inline-flex items-center gap-1 text-xs font-medium text-stone-900 group-hover:translate-x-0.5 transition-transform">
                            <InlineText
                              value={getSiteText(siteTexts, 'timeline.detailsLink', 'Podrobnosti')}
                              onSave={(val) => onUpdateSiteText?.('timeline.detailsLink', val)}
                              isAdmin={isAdmin}
                              label="Tlačítko podrobností"
                            />
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Empty counterpart for grid balance */}
                    <div className="hidden lg:block w-1/2" />
                  </div>

                  {/* Insert milestone between existing ones */}
                  {isAdmin && (
                    <div className="flex items-center justify-center my-3 relative z-20">
                      <button
                        type="button"
                        onClick={() => onInsertItemAt?.(index + 1, item.phase)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-stone-900 text-stone-600 hover:text-white rounded-full text-[11px] font-semibold border border-stone-300 hover:border-transparent shadow-xs transition-all cursor-pointer group/addbtn"
                        title="Vložit nový milník přesně mezi tyto dva"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-600 group-hover/addbtn:text-white" />
                        <span>Vložit milník sem</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-stone-200 shadow-xl space-y-5">
              
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      selectedItem.phase === 'past'
                        ? 'bg-stone-200 text-stone-800 border-stone-300'
                        : selectedItem.phase === 'present'
                        ? 'bg-slate-900 text-white border-slate-800'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}>
                      {getPhaseIcon(selectedItem.phase)}
                      <span>{selectedItem.phaseLabel || getPhaseLabel(selectedItem.phase)}</span>
                    </span>
                    <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                    <span>
                      <InlineText
                        value={selectedItem.timePeriod}
                        onSave={(val) => {
                          onUpdateItem?.(selectedItem.id, { timePeriod: val });
                          setSelectedItem({ ...selectedItem, timePeriod: val });
                        }}
                        isAdmin={isAdmin}
                        label="Časové období"
                      />
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                    <InlineText
                      value={selectedItem.title}
                      onSave={(val) => {
                        onUpdateItem?.(selectedItem.id, { title: val });
                        setSelectedItem({ ...selectedItem, title: val });
                      }}
                      isAdmin={isAdmin}
                      label="Název milníku"
                    />
                  </h3>
                  <div className="text-sm text-stone-600 font-medium mt-0.5">
                    <InlineText
                      value={selectedItem.subtitle}
                      onSave={(val) => {
                        onUpdateItem?.(selectedItem.id, { subtitle: val });
                        setSelectedItem({ ...selectedItem, subtitle: val });
                      }}
                      isAdmin={isAdmin}
                      label="Podtitulek"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        onDeleteItem(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Smazat tento milník"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                    aria-label="Zavřít detail"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Institution / Location */}
              {(selectedItem.organization || selectedItem.location || isAdmin) && (
                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-stone-500" />
                    <InlineText
                      value={selectedItem.organization || ''}
                      onSave={(val) => {
                        onUpdateItem?.(selectedItem.id, { organization: val });
                        setSelectedItem({ ...selectedItem, organization: val });
                      }}
                      isAdmin={isAdmin}
                      placeholder="Přidat organizaci..."
                      label="Organizace"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <InlineText
                      value={selectedItem.location || ''}
                      onSave={(val) => {
                        onUpdateItem?.(selectedItem.id, { location: val });
                        setSelectedItem({ ...selectedItem, location: val });
                      }}
                      isAdmin={isAdmin}
                      placeholder="Přidat lokaci..."
                      label="Lokalita"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1.5">
                  <InlineText
                    value={getSiteText(siteTexts, 'timeline.modalDescTitle', 'Popis etapy')}
                    onSave={(val) => onUpdateSiteText?.('timeline.modalDescTitle', val)}
                    isAdmin={isAdmin}
                    label="Nadpis sekce popisu"
                  />
                </h4>
                <div className="text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                  <InlineText
                    value={selectedItem.description}
                    onSave={(val) => {
                      onUpdateItem?.(selectedItem.id, { description: val });
                      setSelectedItem({ ...selectedItem, description: val });
                    }}
                    isAdmin={isAdmin}
                    multiline
                    rows={4}
                    label="Popis etapy"
                  />
                </div>
              </div>

              {/* Personal Reflection */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">
                  <InlineText
                    value={getSiteText(
                      siteTexts,
                      'timeline.modalReflectionTitle',
                      'Osobní reflexe & význam pro budoucnost'
                    )}
                    onSave={(val) => onUpdateSiteText?.('timeline.modalReflectionTitle', val)}
                    isAdmin={isAdmin}
                    label="Nadpis sekce reflexe"
                  />
                </h4>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 italic text-stone-800 text-sm sm:text-base leading-relaxed">
                  „
                  <InlineText
                    value={selectedItem.personalReflection || ''}
                    onSave={(val) => {
                      onUpdateItem?.(selectedItem.id, { personalReflection: val });
                      setSelectedItem({ ...selectedItem, personalReflection: val });
                    }}
                    isAdmin={isAdmin}
                    multiline
                    rows={3}
                    placeholder="Klikněte pro přidání osobní reflexe..."
                    label="Osobní reflexe"
                  />
                  “
                </div>
              </div>

              {/* Key highlights */}
              {selectedItem.keyHighlights && selectedItem.keyHighlights.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-2">
                    <InlineText
                      value={getSiteText(
                        siteTexts,
                        'timeline.modalHighlightsTitle',
                        'Klíčové milníky & výsledky'
                      )}
                      onSave={(val) => onUpdateSiteText?.('timeline.modalHighlightsTitle', val)}
                      isAdmin={isAdmin}
                      label="Nadpis milníků a výsledků"
                    />
                  </h4>
                  <ul className="space-y-2">
                    {selectedItem.keyHighlights.map((hl, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                        <span className="text-stone-400 mt-0.5">•</span>
                        <div className="flex-1">
                          <InlineText
                            value={hl}
                            onSave={(val) => {
                              const updatedHighlights = [...(selectedItem.keyHighlights || [])];
                              updatedHighlights[hIdx] = val;
                              onUpdateItem?.(selectedItem.id, { keyHighlights: updatedHighlights });
                              setSelectedItem({ ...selectedItem, keyHighlights: updatedHighlights });
                            }}
                            onDelete={() => {
                              const updatedHighlights = (selectedItem.keyHighlights || []).filter(
                                (_, i) => i !== hIdx
                              );
                              onUpdateItem?.(selectedItem.id, { keyHighlights: updatedHighlights });
                              setSelectedItem({ ...selectedItem, keyHighlights: updatedHighlights });
                            }}
                            isAdmin={isAdmin}
                            deleteConfirmPrompt="Opravdu chcete tento bod smazat?"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer tags */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedItem.tags.map((t, idx) => (
                    <span key={idx} className="text-stone-600">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 cursor-pointer"
                >
                  <InlineText
                    value={getSiteText(siteTexts, 'timeline.modalCloseBtn', 'Zavřít')}
                    onSave={(val) => onUpdateSiteText?.('timeline.modalCloseBtn', val)}
                    isAdmin={isAdmin}
                    label="Tlačítko zavření"
                  />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
