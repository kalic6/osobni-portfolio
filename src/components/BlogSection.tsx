import { useState, useEffect } from 'react';
import {
  BookOpen,
  ArrowRight,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  X,
  Search,
  ArrowLeft,
  FolderPlus,
} from 'lucide-react';
import { type BlogPost, getPostTopics, getSiteText } from '../data/portfolioData';
import { InlineText, InlineImage } from './InlineEdit';

interface BlogSectionProps {
  posts: BlogPost[];
  topics: string[];
  siteTexts?: Record<string, string>;
  onUpdateSiteText?: (key: string, value: string) => void;
  isAdmin: boolean;
  isStandaloneView: boolean;
  onToggleStandaloneView: (standalone: boolean) => void;
  onAddPost: () => void;
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onUpdatePost?: (id: string, updatedFields: Partial<BlogPost>) => void;
  onAddTopic: (newTopic: string) => void;
  onOpenPost?: (postId: string) => void;
}

export function BlogSection({
  posts,
  topics,
  siteTexts = {},
  onUpdateSiteText,
  isAdmin,
  isStandaloneView,
  onToggleStandaloneView,
  onAddPost,
  onEditPost,
  onDeletePost,
  onUpdatePost,
  onAddTopic,
  onOpenPost,
}: BlogSectionProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopicInputOpen, setNewTopicInputOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  // Only display topics in filter that have at least one post
  const availableTopics = topics.filter((t) =>
    posts.some((p) => getPostTopics(p).includes(t))
  );

  // Reset selected topic if it has 0 posts
  useEffect(() => {
    if (selectedTopic !== 'all' && !posts.some((p) => getPostTopics(p).includes(selectedTopic))) {
      setSelectedTopic('all');
    }
  }, [posts, selectedTopic]);

  // When on the homepage, only show maximum 4 latest posts
  const displayedPosts = isStandaloneView
    ? posts.filter((post) => {
        const matchesTopic = selectedTopic === 'all' || getPostTopics(post).includes(selectedTopic);
        const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.annotation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
          post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTopic && matchesSearch;
      })
    : posts.slice(0, 4);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopicName.trim()) {
      onAddTopic(newTopicName.trim());
      setNewTopicName('');
      setNewTopicInputOpen(false);
    }
  };

  return (
    <section id="blog" className="py-16 md:py-24 bg-stone-100/50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation button when in standalone view */}
        {isStandaloneView && (
          <div className="mb-8">
            <button
              onClick={() => onToggleStandaloneView(false)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 transition-colors p-2 -ml-2 rounded-lg hover:bg-stone-200/60 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <InlineText
                value={getSiteText(siteTexts, 'blog.backBtn', 'Zpět na hlavní portfolio')}
                onSave={(val) => onUpdateSiteText?.('blog.backBtn', val)}
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
              <span>Klikněte přímo na titulek, anotaci, citaci či fotografii kteréhokoliv článku pro okamžitou úpravu.</span>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs tracking-wider text-stone-500 uppercase font-semibold mb-2">
              <InlineText
                value={getSiteText(siteTexts, 'blog.kickerLeft', 'Úvahy & Eseje')}
                onSave={(val) => onUpdateSiteText?.('blog.kickerLeft', val)}
                isAdmin={isAdmin}
                label="Kategorie vlevo"
              />
              <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
              <InlineText
                value={
                  isStandaloneView
                    ? getSiteText(siteTexts, 'blog.kickerRightArchive', 'Kompletní archiv blogu')
                    : getSiteText(siteTexts, 'blog.kickerRightHome', 'Výběr nejnovějších článků')
                }
                onSave={(val) =>
                  onUpdateSiteText?.(
                    isStandaloneView ? 'blog.kickerRightArchive' : 'blog.kickerRightHome',
                    val
                  )
                }
                isAdmin={isAdmin}
                label="Kategorie vpravo"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              <InlineText
                value={
                  isStandaloneView
                    ? getSiteText(siteTexts, 'blog.titleArchive', 'Blog: Úvahy o informacích a gramotnosti')
                    : getSiteText(siteTexts, 'blog.titleHome', 'Nejnovější z mého blogu')
                }
                onSave={(val) =>
                  onUpdateSiteText?.(
                    isStandaloneView ? 'blog.titleArchive' : 'blog.titleHome',
                    val
                  )
                }
                isAdmin={isAdmin}
                label="Hlavní nadpis blogu"
              />
            </h2>
            <div className="mt-2 text-base text-stone-600 max-w-2xl font-normal">
              <InlineText
                value={
                  isStandaloneView
                    ? getSiteText(
                        siteTexts,
                        'blog.subtitleArchive',
                        'Pravidelné i příležitostné texty, glosy a analýzy ze světa informační vědy, vzdělávání, knižní kultury a osobní produktivity.'
                      )
                    : getSiteText(
                        siteTexts,
                        'blog.subtitleHome',
                        'Ukázka z mých textů věnovaných informační vědě, médiím a kritickému myšlení. Všechny články najdete v archivu.'
                      )
                }
                onSave={(val) =>
                  onUpdateSiteText?.(
                    isStandaloneView ? 'blog.subtitleArchive' : 'blog.subtitleHome',
                    val
                  )
                }
                isAdmin={isAdmin}
                multiline
                rows={2}
                label="Podtitulek blogu"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <button
                onClick={onAddPost}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{getSiteText(siteTexts, 'blog.addPostBtn', 'Napsat nový článek')}</span>
              </button>
            )}

            {!isStandaloneView && (
              <button
                onClick={() => onToggleStandaloneView(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-lg text-xs font-semibold hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer shrink-0"
              >
                <span>Všechny články ({posts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Toolbar (Displayed in Standalone view or with topics) */}
        {isStandaloneView && (
          <div className="space-y-4 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Topic Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-200/70 rounded-xl max-w-full">
                <button
                  onClick={() => setSelectedTopic('all')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedTopic === 'all'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Všechna témata ({posts.length})
                </button>
                {availableTopics.map((t) => {
                  const count = posts.filter((p) => getPostTopics(p).includes(t)).length;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        selectedTopic === t
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {t} ({count})
                    </button>
                  );
                })}

                {isAdmin && (
                  <button
                    onClick={() => setNewTopicInputOpen(true)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Přidat nové téma"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Keyword Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Hledat v článcích..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-400 text-stone-900 shadow-2xs"
                />
              </div>
            </div>

            {/* Quick inline topic add input */}
            {newTopicInputOpen && (
              <form onSubmit={handleCreateTopic} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-200 shadow-xs max-w-md animate-in fade-in duration-150">
                <input
                  type="text"
                  placeholder="Název nového tématu..."
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="flex-1 px-3 py-1 text-xs sm:text-sm border border-stone-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-stone-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-stone-900 text-white text-xs font-semibold rounded-md hover:bg-stone-800 cursor-pointer"
                >
                  Přidat
                </button>
                <button
                  type="button"
                  onClick={() => setNewTopicInputOpen(false)}
                  className="px-2 py-1 text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Zrušit
                </button>
              </form>
            )}
          </div>
        )}

        {/* Articles Grid */}
        {displayedPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
            <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-stone-700">V tomto tématu zatím nejsou žádné články.</p>
            <p className="text-xs text-stone-500 mt-1">Zkuste vybrat jiné téma nebo zrušit vyhledávací filtr.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {displayedPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:border-stone-400 hover:shadow-md transition-all flex flex-col justify-between relative"
              >
                <div>
                  {/* Photo with InlineImage support */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-200">
                    <InlineImage
                      src={post.imageUrl}
                      alt={post.title}
                      onSave={(newUrl) => onUpdatePost?.(post.id, { imageUrl: newUrl })}
                      isAdmin={isAdmin}
                      aspectClass="aspect-16/10"
                    />
                    
                    {/* Topic Badges Overlay */}
                    <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 pointer-events-auto">
                      {getPostTopics(post).map((topicLabel, tIdx) => (
                        <div
                          key={`${topicLabel}-${tIdx}`}
                          className="px-2.5 py-1 bg-stone-950/80 backdrop-blur-xs text-white text-xs font-semibold rounded-md"
                        >
                          <InlineText
                            value={topicLabel}
                            onSave={(val) => {
                              const currentTopics = getPostTopics(post);
                              const updatedTopics = currentTopics.map((t, idx) =>
                                idx === tIdx ? val : t
                              );
                              onUpdatePost?.(post.id, {
                                topic: updatedTopics[0] || val,
                                topics: updatedTopics,
                              });
                            }}
                            isAdmin={isAdmin}
                            label="Téma článku"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7">
                    
                    {/* Metadata Header & Admin Controls */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <InlineText
                            value={post.date}
                            onSave={(val) => onUpdatePost?.(post.id, { date: val })}
                            isAdmin={isAdmin}
                            label="Datum publikace"
                          />
                        </span>
                        <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <InlineText
                            value={post.readTime}
                            onSave={(val) => onUpdatePost?.(post.id, { readTime: val })}
                            isAdmin={isAdmin}
                            label="Doba čtení"
                          />
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditPost(post)}
                            className="p-1 hover:bg-stone-100 rounded text-stone-600 hover:text-stone-900 cursor-pointer"
                            title="Upravit článek formulářem"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeletePost(post.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700 cursor-pointer"
                            title="Smazat článek"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Headline */}
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors leading-snug">
                      <InlineText
                        value={post.title}
                        onSave={(val) => onUpdatePost?.(post.id, { title: val })}
                        isAdmin={isAdmin}
                        label="Titulek článku"
                      />
                    </h3>

                    {/* Annotation */}
                    <div className="mt-3 text-sm text-stone-600 leading-relaxed font-normal">
                      <InlineText
                        value={post.annotation}
                        onSave={(val) => onUpdatePost?.(post.id, { annotation: val })}
                        isAdmin={isAdmin}
                        multiline
                        rows={3}
                        label="Anotace článku"
                      />
                    </div>

                    {/* Featured Quote Callout */}
                    {(post.featuredQuote || isAdmin) && (
                      <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200/80">
                        <div className="italic text-xs sm:text-sm text-stone-800 leading-relaxed">
                          <span className="select-none">„</span>
                          <InlineText
                            value={(post.featuredQuote || '').replace(/^["„“”]/, '').replace(/["„“”]$/, '').trim()}
                            onSave={(val) =>
                              onUpdatePost?.(post.id, {
                                featuredQuote: val.replace(/^["„“”]/, '').replace(/["„“”]$/, '').trim(),
                              })
                            }
                            isAdmin={isAdmin}
                            placeholder="Přidat klíčovou myšlenku / citaci..."
                            as="span"
                            multiline
                            rows={2}
                            label="Vybraná citace"
                          />
                          <span className="select-none">“</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Read More button and Tags */}
                <div className="px-6 sm:px-7 pb-6 pt-0">
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                      {post.tags.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx}>#{tag}</span>
                      ))}
                    </div>

                    <button
                      onClick={() => onOpenPost?.(post.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-stone-700 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    >
                      <InlineText
                        value={siteTexts['blog.readMoreBtn'] || 'Přečíst celý text'}
                        onSave={(val) => onUpdateSiteText?.('blog.readMoreBtn', val)}
                        isAdmin={isAdmin}
                        label="Tlačítko přečíst článek"
                      />
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

        {/* Homepage Bottom Action */}
        {!isStandaloneView && (
          <div className="mt-14 text-center">
            <div className="p-8 sm:p-10 bg-white rounded-2xl border border-stone-200 shadow-2xs max-w-2xl mx-auto space-y-3">
              <h3 className="text-xl font-bold text-stone-900">
                <InlineText
                  value={siteTexts['blog.ctaBoxTitle'] || 'Chcete si přečíst více článků a témat?'}
                  onSave={(val) => onUpdateSiteText?.('blog.ctaBoxTitle', val)}
                  isAdmin={isAdmin}
                  label="Nadpis výzvy k archivu blogu"
                />
              </h3>
              <div className="text-sm text-stone-600 leading-relaxed font-normal">
                <InlineText
                  value={siteTexts['blog.ctaBoxDesc'] || 'V samostatné sekci blogu najdete kompletní archiv textů přehledně rozdělený do témat: Informační gramotnost, Práce s informacemi, Knížky a publikace a Z osobního života.'}
                  onSave={(val) => onUpdateSiteText?.('blog.ctaBoxDesc', val)}
                  isAdmin={isAdmin}
                  multiline
                  rows={2}
                  label="Popis výzvy k archivu blogu"
                />
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onToggleStandaloneView(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-stone-50 rounded-xl text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                >
                  <InlineText
                    value={siteTexts['blog.ctaBoxBtn'] || 'Přejít do kompletního archivu blogu'}
                    onSave={(val) => onUpdateSiteText?.('blog.ctaBoxBtn', val)}
                    isAdmin={isAdmin}
                    label="Tlačítko přechodu do archivu"
                  />
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
