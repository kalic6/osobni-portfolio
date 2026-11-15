import { ArrowLeft, Briefcase, Calendar, MapPin, Plus, Edit3, Trash2, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { type WorkExperience, getSiteText } from '../data/portfolioData';
import { InlineText } from './InlineEdit';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  siteTexts?: Record<string, string>;
  onUpdateSiteText?: (key: string, value: string) => void;
  isAdmin: boolean;
  onAddExperience: () => void;
  onEditExperience: (exp: WorkExperience) => void;
  onDeleteExperience: (id: string) => void;
  onMoveExperience?: (id: string, direction: 'up' | 'down') => void;
  onUpdateExperience?: (id: string, updatedFields: Partial<WorkExperience>) => void;
  onBackToHome?: () => void;
}

export function ExperienceSection({
  experiences,
  siteTexts = {},
  onUpdateSiteText,
  isAdmin,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onMoveExperience,
  onUpdateExperience,
  onBackToHome,
}: ExperienceSectionProps) {
  return (
    <section id="zkusenosti" className="py-16 md:py-24 bg-stone-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button */}
        {onBackToHome && (
          <div className="mb-8">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors p-2 -ml-2 rounded-lg hover:bg-stone-200/60 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <InlineText
                value={getSiteText(siteTexts, 'experience.backBtn', 'Zpět na hlavní portfolio')}
                onSave={(val) => onUpdateSiteText?.('experience.backBtn', val)}
                isAdmin={isAdmin}
                label="Tlačítko zpět"
              />
            </button>
          </div>
        )}

        {/* Admin hint */}
        {isAdmin && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold">Režim přímých úprav aktivní:</span>
              <span>Klikněte přímo na pozici, organizaci, období, shrnutí či reflexi kterékoliv zkušenosti pro okamžitou úpravu.</span>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-wider text-stone-500 uppercase font-semibold mb-2">
              <InlineText
                value={getSiteText(siteTexts, 'experience.kickerLeft', 'Profesní praxe')}
                onSave={(val) => onUpdateSiteText?.('experience.kickerLeft', val)}
                isAdmin={isAdmin}
                label="Kategorie vlevo"
              />
              <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
              <InlineText
                value={getSiteText(siteTexts, 'experience.kickerRight', 'Kariéra & Projekty')}
                onSave={(val) => onUpdateSiteText?.('experience.kickerRight', val)}
                isAdmin={isAdmin}
                label="Kategorie vpravo"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              <InlineText
                value={getSiteText(siteTexts, 'experience.title', 'Pracovní zkušenosti')}
                onSave={(val) => onUpdateSiteText?.('experience.title', val)}
                isAdmin={isAdmin}
                label="Hlavní nadpis sekce"
              />
            </h2>
            <div className="mt-2 text-base text-stone-600 max-w-2xl font-normal">
              <InlineText
                value={getSiteText(
                  siteTexts,
                  'experience.subtitle',
                  'Pozice, které mám za sebou, časová období a má osobní reflexe toho, jak posunuly mé vnímání informační praxe.'
                )}
                onSave={(val) => onUpdateSiteText?.('experience.subtitle', val)}
                isAdmin={isAdmin}
                multiline
                rows={2}
                label="Podtitulek sekce"
              />
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={onAddExperience}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{getSiteText(siteTexts, 'experience.addBtn', 'Přidat zkušenost')}</span>
            </button>
          )}
        </div>

        {/* Experience List / Cards */}
        <div className="space-y-8">
          {experiences.map((exp, index) => {
            const isFirst = index === 0;
            const isLast = index === experiences.length - 1;

            return (
              <div
                key={exp.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 hover:border-stone-400 hover:shadow-xs transition-all relative group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Header Information */}
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                        <InlineText
                          value={exp.organization}
                          onSave={(val) => onUpdateExperience?.(exp.id, { organization: val })}
                          isAdmin={isAdmin}
                          label="Organizace / Firma"
                        />
                      </span>
                      <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <InlineText
                          value={exp.period}
                          onSave={(val) => onUpdateExperience?.(exp.id, { period: val })}
                          isAdmin={isAdmin}
                          label="Časové období"
                        />
                      </span>
                      <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <InlineText
                          value={exp.location}
                          onSave={(val) => onUpdateExperience?.(exp.id, { location: val })}
                          isAdmin={isAdmin}
                          label="Lokalita"
                        />
                      </span>
                      {exp.isCurrent && (
                        <>
                          <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                          <span className="text-emerald-700 font-medium">Aktuální působení</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 pt-1 font-serif">
                      <InlineText
                        value={exp.role}
                        onSave={(val) => onUpdateExperience?.(exp.id, { role: val })}
                        isAdmin={isAdmin}
                        label="Název pozice"
                      />
                    </h3>
                    <div className="text-xs sm:text-sm text-stone-500 font-medium">
                      <InlineText
                        value={exp.type}
                        onSave={(val) => onUpdateExperience?.(exp.id, { type: val })}
                        isAdmin={isAdmin}
                        label="Typ úvazku"
                      />
                    </div>
                  </div>

                  {/* Admin controls */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 self-start shrink-0 flex-wrap">
                      {onMoveExperience && (
                        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => onMoveExperience(exp.id, 'up')}
                            className={`p-1 rounded transition-colors ${
                              isFirst
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-stone-700 hover:text-stone-950 hover:bg-white cursor-pointer'
                            }`}
                            title="Posunout zkušenost výše"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => onMoveExperience(exp.id, 'down')}
                            className={`p-1 rounded transition-colors ${
                              isLast
                                ? 'text-stone-300 cursor-not-allowed'
                                : 'text-stone-700 hover:text-stone-950 hover:bg-white cursor-pointer'
                            }`}
                            title="Posunout zkušenost níže"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => onEditExperience(exp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
                        title="Upravit zkušenost formulářem"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Upravit</span>
                      </button>
                      <button
                        onClick={() => onDeleteExperience(exp.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded cursor-pointer font-medium"
                        title="Smazat tuto zkušenost"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Smazat</span>
                      </button>
                    </div>
                  )}
                </div>

              {/* Summary */}
              <div className="mt-4 text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                <InlineText
                  value={exp.summary}
                  onSave={(val) => onUpdateExperience?.(exp.id, { summary: val })}
                  isAdmin={isAdmin}
                  multiline
                  rows={3}
                  label="Shrnutí náplně pozice"
                />
              </div>

              {/* Personal Reflection & Comment */}
              <div className="mt-5 p-5 bg-stone-50 rounded-xl border border-stone-200/70">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-1.5">
                  <InlineText
                    value={siteTexts['experience.reflectionLabel'] || 'Osobní reflexe & co mi pozice dala'}
                    onSave={(val) => onUpdateSiteText?.('experience.reflectionLabel', val)}
                    isAdmin={isAdmin}
                    label="Nadpis reflexe"
                  />
                </h4>
                <div className="italic text-sm sm:text-base text-stone-800 leading-relaxed">
                  „
                  <InlineText
                    value={exp.comment}
                    onSave={(val) => onUpdateExperience?.(exp.id, { comment: val })}
                    isAdmin={isAdmin}
                    multiline
                    rows={3}
                    label="Osobní komentář a reflexe"
                  />
                  “
                </div>
              </div>

              {/* Key Achievements */}
              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                    <InlineText
                      value={siteTexts['experience.achievementsLabel'] || 'Hlavní přínos a konkrétní výsledky'}
                      onSave={(val) => onUpdateSiteText?.('experience.achievementsLabel', val)}
                      isAdmin={isAdmin}
                      label="Nadpis přínosů a výsledků"
                    />
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {exp.achievements.map((ach, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-start gap-2 p-3 bg-white rounded-lg border border-stone-200/80 text-xs sm:text-sm text-stone-700 relative group/ach"
                      >
                        <CheckCircle2 className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <InlineText
                            value={ach}
                            onSave={(val) => {
                              const updated = [...(exp.achievements || [])];
                              updated[aIdx] = val;
                              onUpdateExperience?.(exp.id, { achievements: updated });
                            }}
                            onDelete={() => {
                              const updated = (exp.achievements || []).filter((_, i) => i !== aIdx);
                              onUpdateExperience?.(exp.id, { achievements: updated });
                            }}
                            isAdmin={isAdmin}
                            deleteConfirmPrompt="Opravdu chcete tento bod přínosu smazat?"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills unboxed with separators */}
              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">
                    <InlineText
                      value={siteTexts['experience.skillsLabel'] || 'Dovednosti:'}
                      onSave={(val) => onUpdateSiteText?.('experience.skillsLabel', val)}
                      isAdmin={isAdmin}
                      label="Štítek dovedností"
                    />
                  </span>
                  {exp.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="flex items-center">
                      <span className="text-stone-600">{skill}</span>
                      {sIdx < exp.skills.length - 1 && (
                        <span className="text-stone-300 ml-2" aria-hidden="true">·</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

            </div>
          );
        })}
        </div>

      </div>
    </section>
  );
}
