import { useState } from 'react';
import { ArrowLeft, BookOpen, Search, Plus, Edit3, Trash2, Award, ArrowUp, ArrowDown } from 'lucide-react';
import { type StudyCourse, getSiteText } from '../data/portfolioData';
import { InlineText } from './InlineEdit';

interface StudySectionProps {
  courses: StudyCourse[];
  siteTexts?: Record<string, string>;
  onUpdateSiteText?: (key: string, value: string) => void;
  isAdmin: boolean;
  onAddCourse: () => void;
  onEditCourse: (course: StudyCourse) => void;
  onDeleteCourse: (id: string) => void;
  onMoveCourse?: (id: string, direction: 'up' | 'down') => void;
  onUpdateCourse?: (id: string, updatedFields: Partial<StudyCourse>) => void;
  onBackToHome?: () => void;
}

export function StudySection({
  courses,
  siteTexts = {},
  onUpdateSiteText,
  isAdmin,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onMoveCourse,
  onUpdateCourse,
  onBackToHome,
}: StudySectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.comment.toLowerCase().includes(q) ||
      c.competencies.some((comp) => comp.toLowerCase().includes(q))
    );
  });

  return (
    <section id="studium" className="py-16 md:py-24 bg-white min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button */}
        {onBackToHome && (
          <div className="mb-8">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors p-2 -ml-2 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <InlineText
                value={getSiteText(siteTexts, 'study.backBtn', 'Zpět na hlavní portfolio')}
                onSave={(val) => onUpdateSiteText?.('study.backBtn', val)}
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
              <span>Klikněte na jakýkoliv text pro okamžitou editaci, šipkami můžete měnit pořadí předmětů a košem předmět smazat.</span>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-wider text-stone-500 uppercase font-semibold mb-2">
              <InlineText
                value={getSiteText(siteTexts, 'study.kickerLeft', 'Akademická dráha')}
                onSave={(val) => onUpdateSiteText?.('study.kickerLeft', val)}
                isAdmin={isAdmin}
                label="Kategorie vlevo"
              />
              <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
              <InlineText
                value={getSiteText(siteTexts, 'study.kickerRight', 'Absolvované předměty')}
                onSave={(val) => onUpdateSiteText?.('study.kickerRight', val)}
                isAdmin={isAdmin}
                label="Kategorie vpravo"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif">
              <InlineText
                value={getSiteText(siteTexts, 'study.title', 'Studium a odborné předměty')}
                onSave={(val) => onUpdateSiteText?.('study.title', val)}
                isAdmin={isAdmin}
                label="Hlavní nadpis sekce"
              />
            </h2>
            <div className="mt-2 text-base text-stone-600 max-w-2xl font-normal">
              <InlineText
                value={getSiteText(
                  siteTexts,
                  'study.subtitle',
                  'Přehled absolvovaných odborných předmětů a především má osobní reflexe toho, co mě naučily a jak posunuly mé vnímání informační praxe.'
                )}
                onSave={(val) => onUpdateSiteText?.('study.subtitle', val)}
                isAdmin={isAdmin}
                multiline
                rows={2}
                label="Podtitulek sekce"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Hledat předmět či dovednost..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 focus:bg-white text-stone-900"
              />
            </div>

            {isAdmin && (
              <button
                onClick={onAddCourse}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{getSiteText(siteTexts, 'study.addBtn', 'Přidat předmět')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Courses Cards Grid - Clean, unified without semester divisions */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-700">Nebyly nalezeny žádné předměty.</p>
            <p className="text-xs text-stone-500 mt-1">Zkuste upravit vyhledávací dotaz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const isFirst = index === 0;
              const isLast = index === filteredCourses.length - 1;

              return (
                <div
                  key={course.id}
                  className="bg-[#FAF9F6] p-6 sm:p-7 rounded-2xl border border-stone-200/90 hover:border-stone-400 hover:bg-white transition-all flex flex-col h-full group shadow-2xs relative"
                >
                  {/* Top content: Code, Title, Status, Credits & Commentary (absorbs variable comment length) */}
                  <div className="flex-1 flex flex-col">
                    {/* Top unboxed metadata & Reorder/Action controls */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2 gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-stone-800 font-mono text-xs">
                          <InlineText
                            value={course.code}
                            onSave={(val) => onUpdateCourse?.(course.id, { code: val })}
                            isAdmin={isAdmin}
                            label="Kód předmětu"
                          />
                        </span>
                        {course.semester && (
                          <>
                            <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                            <span className="text-stone-600">{course.semester} {course.academicYear}</span>
                          </>
                        )}
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                          {/* Reordering Up/Down */}
                          {onMoveCourse && (
                            <>
                              <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => onMoveCourse(course.id, 'up')}
                                className={`p-1 rounded transition-colors ${
                                  isFirst
                                    ? 'text-stone-300 cursor-not-allowed'
                                    : 'text-stone-700 hover:text-stone-950 hover:bg-white cursor-pointer'
                                }`}
                                title="Posunout předmět výše"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={isLast}
                                onClick={() => onMoveCourse(course.id, 'down')}
                                className={`p-1 rounded transition-colors ${
                                  isLast
                                    ? 'text-stone-300 cursor-not-allowed'
                                    : 'text-stone-700 hover:text-stone-950 hover:bg-white cursor-pointer'
                                }`}
                                title="Posunout předmět níže"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <div className="w-px h-3.5 bg-stone-300 mx-0.5" />
                            </>
                          )}
                          <button
                            onClick={() => onEditCourse(course)}
                            className="p-1 hover:bg-white rounded text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="Upravit předmět formulářem"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCourse(course.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 cursor-pointer"
                            title="Smazat předmět"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Course Title */}
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug group-hover:text-stone-700 transition-colors font-serif">
                      <InlineText
                        value={course.title}
                        onSave={(val) => onUpdateCourse?.(course.id, { title: val })}
                        isAdmin={isAdmin}
                        label="Název předmětu"
                      />
                    </h3>

                    {/* Status */}
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-stone-700 font-medium">
                        <Award className="w-3 h-3 text-stone-500" />
                        <InlineText
                          value={course.status}
                          onSave={(val) => onUpdateCourse?.(course.id, { status: val })}
                          isAdmin={isAdmin}
                          label="Stav absolvování"
                        />
                      </span>
                    </div>

                    {/* Personal Commentary */}
                    <div className="mt-4 pt-3 border-t border-stone-200/60 flex-1 flex flex-col">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-1">
                        <InlineText
                          value={siteTexts['study.commentLabel'] || 'Můj komentář & přínos'}
                          onSave={(val) => onUpdateSiteText?.('study.commentLabel', val)}
                          isAdmin={isAdmin}
                          label="Štítek komentáře"
                        />
                      </p>
                      <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal flex-1">
                        <InlineText
                          value={course.comment}
                          onSave={(val) => onUpdateCourse?.(course.id, { comment: val })}
                          isAdmin={isAdmin}
                          multiline
                          rows={3}
                          label="Komentář k předmětu"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pinned Bottom Area: Key Project & Competencies - Aligned in one horizontal plane across all cards */}
                  <div className="mt-auto pt-4 flex flex-col">
                    {/* Key Project (uniform min-height so boxes never jump) */}
                    {(course.keyProject || isAdmin) ? (
                      <div className="p-3 bg-white/90 rounded-xl border border-stone-200/70 text-xs min-h-[76px] flex flex-col justify-center">
                        <span className="font-semibold text-stone-700 block mb-0.5">
                          <InlineText
                            value={siteTexts['study.projectLabel'] || 'Semestrální projekt:'}
                            onSave={(val) => onUpdateSiteText?.('study.projectLabel', val)}
                            isAdmin={isAdmin}
                            label="Štítek projektu"
                          />
                        </span>
                        <div className="text-stone-600 line-clamp-3">
                          <InlineText
                            value={course.keyProject || ''}
                            onSave={(val) => onUpdateCourse?.(course.id, { keyProject: val })}
                            isAdmin={isAdmin}
                            placeholder="Přidat semestrální projekt..."
                            label="Projekt"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[76px] p-3 rounded-xl border border-dashed border-stone-200/60 text-xs flex flex-col justify-center text-stone-400 italic">
                        <span className="font-semibold text-stone-400 block mb-0.5 text-[11px]">
                          {siteTexts['study.projectLabel'] || 'Semestrální projekt:'}
                        </span>
                        <span>Bez semestrálního projektu</span>
                      </div>
                    )}

                    {/* Acquired Competencies (uniform min-height so the project box above it aligns horizontally) */}
                    <div className="mt-4 pt-3 border-t border-stone-200/60">
                      <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-1.5 min-h-[38px]">
                        {course.competencies.map((comp, idx) => (
                          <span key={idx} className="flex items-center">
                            <span className="text-stone-700 font-medium">{comp}</span>
                            {idx < course.competencies.length - 1 && (
                              <span className="text-stone-300 ml-1.5" aria-hidden="true">·</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
