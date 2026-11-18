import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Printer,
  Edit3,
  Trash2,
  Plus,
  Image as ImageIcon,
  Check,
  ChevronUp,
  ChevronDown,
  Camera,
  Upload,
  X,
  BookOpen,
  ArrowRight,
  Instagram,
} from 'lucide-react';
import { type BlogPost, type ManifestData, getPostTopics, getSiteText } from '../data/portfolioData';
import { InlineText, InlineImage, PRESET_PORTFOLIO_IMAGES } from './InlineEdit';
import { FormattedParagraph } from './FormattedArticleContent';
import { useConfirm } from './ConfirmModal';

interface ArticleDetailViewProps {
  post: BlogPost;
  allPosts: BlogPost[];
  author: {
    name: string;
    role: string;
    email: string;
    location: string;
    photoUrl: string;
  };
  siteTexts?: Record<string, string>;
  onUpdateSiteText?: (key: string, value: string) => void;
  onUpdateManifest?: (updated: Partial<ManifestData>) => void;
  isAdmin: boolean;
  onBackToBlog: () => void;
  onBackToHome: () => void;
  onOpenPost: (postId: string) => void;
  onEditPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onUpdatePost: (id: string, updated: Partial<BlogPost>) => void;
}

export function ArticleDetailView({
  post,
  allPosts,
  author,
  siteTexts = {},
  onUpdateSiteText,
  onUpdateManifest,
  isAdmin,
  onBackToBlog,
  onBackToHome,
  onOpenPost,
  onEditPost,
  onDeletePost,
  onUpdatePost,
}: ArticleDetailViewProps) {
  const { requestConfirm } = useConfirm();
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const [imageUrlDraft, setImageUrlDraft] = useState(PRESET_PORTFOLIO_IMAGES[1].url);
  const [editingImageIdx, setEditingImageIdx] = useState<number | null>(null);

  // Filter other articles to recommend at the end of the post
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Add paragraph helper
  const handleAddParagraph = () => {
    const updated = [...post.content, 'Nový odstavec textu článku...'];
    onUpdatePost(post.id, { content: updated });
  };

  // Open modal to add a new image
  const handleOpenAddImageModal = () => {
    setImageCaption('');
    setImageUrlDraft(PRESET_PORTFOLIO_IMAGES[1].url);
    setEditingImageIdx(null);
    setImageModalOpen(true);
  };

  // Open modal to edit an existing image in the content
  const handleOpenEditImageModal = (idx: number, currentCaption: string, currentUrl: string) => {
    setImageCaption(currentCaption);
    setImageUrlDraft(currentUrl);
    setEditingImageIdx(idx);
    setImageModalOpen(true);
  };

  // Commit image to article content
  const handleSaveImageToContent = () => {
    const formattedMarkdown = `![${imageCaption.trim()}](${imageUrlDraft.trim()})`;
    const updated = [...post.content];
    if (editingImageIdx !== null) {
      updated[editingImageIdx] = formattedMarkdown;
    } else {
      updated.push(formattedMarkdown);
    }
    onUpdatePost(post.id, { content: updated });
    setImageModalOpen(false);
  };

  // Image file upload handler for custom image
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageUrlDraft(result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Move paragraph / image up or down
  const handleMoveParagraph = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= post.content.length) return;
    const updated = [...post.content];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    onUpdatePost(post.id, { content: updated });
  };

  // Delete paragraph / image
  const handleDeleteParagraph = (idx: number) => {
    requestConfirm({
      title: 'Smazat položku',
      message: 'Opravdu chcete tuto část (odstavec či obrázek) z článku smazat?',
      confirmLabel: 'Smazat',
      onConfirm: () => {
        const updated = post.content.filter((_, i) => i !== idx);
        onUpdatePost(post.id, { content: updated });
      },
    });
  };

  return (
    <article className="min-h-screen py-10 md:py-16 bg-[#F8F7F5] text-stone-900 transition-colors animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Bar & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-stone-600">
            <button
              onClick={onBackToBlog}
              className="inline-flex items-center gap-1.5 text-stone-900 hover:text-stone-700 font-semibold transition-colors cursor-pointer p-1 -ml-1 rounded hover:bg-stone-200/60"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{getSiteText(siteTexts, 'article.backToBlog', 'Zpět na blog')}</span>
            </button>
            <span aria-hidden="true" className="text-stone-300 font-light mx-1">/</span>
            <button
              onClick={onBackToHome}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              {getSiteText(siteTexts, 'article.breadcrumbHome', 'Portfolio')}
            </button>
            <span aria-hidden="true" className="text-stone-300 font-light mx-1">/</span>
            <span className="text-stone-900 font-semibold">
              {getPostTopics(post).join(' · ')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer shadow-2xs"
              title="Zkopírovat odkaz na článek"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Odkaz zkopírován' : 'Sdílet'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer shadow-2xs hidden sm:inline-flex"
              title="Vytisknout článek"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Tisk</span>
            </button>

            {isAdmin && (
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-stone-300">
                <button
                  type="button"
                  onClick={() => onEditPost(post)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
                  title="Upravit celý článek ve formuláři"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Formulář</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePost(post.id)}
                  className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Smazat článek"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Admin hint bar */}
        {isAdmin && (
          <div className="mb-8 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-950 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="font-bold">Režim plné editace článku aktivní:</span>
              <span>Klikněte přímo na titulek, anotaci, citaci, odstavec či fotografii pro okamžitou úpravu.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddImageModal}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/90 hover:bg-amber-300 text-amber-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>+ Vložit obrázek</span>
              </button>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Přidat odstavec</span>
              </button>
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          
          {/* Metadata Kicker row */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600 tracking-wide uppercase">
            {getPostTopics(post).map((topicLabel, tIdx) => (
              <span
                key={`${topicLabel}-${tIdx}`}
                className="inline-flex items-center px-3 py-1 rounded-md bg-stone-900 text-white font-semibold text-[11px] shadow-2xs"
              >
                <InlineText
                  value={topicLabel}
                  onSave={(val) => {
                    const currentTopics = getPostTopics(post);
                    const updatedTopics = currentTopics.map((t, idx) =>
                      idx === tIdx ? val : t
                    );
                    onUpdatePost(post.id, {
                      topic: updatedTopics[0] || val,
                      topics: updatedTopics,
                    });
                  }}
                  isAdmin={isAdmin}
                  label="Téma článku"
                />
              </span>
            ))}
            <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <InlineText
                value={post.date}
                onSave={(val) => onUpdatePost(post.id, { date: val })}
                isAdmin={isAdmin}
                label="Datum publikace"
              />
            </span>
            <span aria-hidden="true" className="text-stone-300 font-light mx-1">|</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <InlineText
                value={post.readTime}
                onSave={(val) => onUpdatePost(post.id, { readTime: val })}
                isAdmin={isAdmin}
                label="Doba čtení"
              />
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-950 font-serif leading-[1.2]">
            <InlineText
              value={post.title}
              onSave={(val) => onUpdatePost(post.id, { title: val })}
              isAdmin={isAdmin}
              label="Titulek článku"
              multiline
              rows={2}
            />
          </h1>

          {/* Lead / Annotation */}
          <div className="text-lg sm:text-xl text-stone-700 leading-relaxed font-light border-l-2 border-stone-900 pl-4 py-1 mt-4">
            <InlineText
              value={post.annotation}
              onSave={(val) => onUpdatePost(post.id, { annotation: val })}
              isAdmin={isAdmin}
              label="Úvodní anotace / perex"
              multiline
              rows={3}
            />
          </div>
        </header>

        {/* Featured Hero Image */}
        <div className="mb-10 rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-200">
          <InlineImage
            src={post.imageUrl}
            alt={post.title}
            onSave={(newUrl) => onUpdatePost(post.id, { imageUrl: newUrl })}
            isAdmin={isAdmin}
            aspectClass="aspect-16/9"
          />
        </div>

        {/* Article Body Content */}
        <div className="space-y-6 text-stone-800 text-base sm:text-lg leading-relaxed pt-2">
          {post.content.map((item, idx) => {
            const isImage = item.trim().startsWith('![');

            return (
              <div key={idx} className="relative group/content">
                {isImage ? (
                  /* Render as image block */
                  <div className="relative">
                    <FormattedParagraph text={item} />
                    
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 p-1 bg-stone-900/80 backdrop-blur-xs rounded-lg text-white opacity-0 group-hover/content:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            const match = item.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                            if (match) {
                              handleOpenEditImageModal(idx, match[1], match[2]);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs hover:bg-stone-800 rounded cursor-pointer"
                          title="Změnit obrázek nebo popisek"
                        >
                          <Camera className="w-3.5 h-3.5 text-amber-400" />
                          <span>Změnit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveParagraph(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-stone-800 rounded disabled:opacity-30 cursor-pointer"
                          title="Posunout nahoru"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveParagraph(idx, 'down')}
                          disabled={idx === post.content.length - 1}
                          className="p-1 hover:bg-stone-800 rounded disabled:opacity-30 cursor-pointer"
                          title="Posunout dolů"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteParagraph(idx)}
                          className="p-1 hover:bg-red-600 rounded text-red-300 hover:text-white cursor-pointer"
                          title="Smazat obrázek"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Render as text paragraph with inline editing */
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <InlineText
                        as="div"
                        value={item}
                        onSave={(newVal) => {
                          const updated = [...post.content];
                          updated[idx] = newVal;
                          onUpdatePost(post.id, { content: updated });
                        }}
                        onDelete={() => handleDeleteParagraph(idx)}
                        deleteConfirmPrompt="Opravdu chcete tento odstavec smazat?"
                        isAdmin={isAdmin}
                        multiline
                        rows={4}
                      />
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover/content:opacity-100 transition-opacity bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0 self-start mt-1">
                        <button
                          type="button"
                          onClick={() => handleMoveParagraph(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-stone-500 hover:text-stone-900 rounded disabled:opacity-30 cursor-pointer"
                          title="Posunout odstavec nahoru"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveParagraph(idx, 'down')}
                          disabled={idx === post.content.length - 1}
                          className="p-1 text-stone-500 hover:text-stone-900 rounded disabled:opacity-30 cursor-pointer"
                          title="Posunout odstavec dolů"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteParagraph(idx)}
                          className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                          title="Smazat odstavec"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Admin Content Insertion Toolbar */}
        {isAdmin && (
          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAddParagraph}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Přidat textový odstavec</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddImageModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-800 rounded-xl text-xs font-semibold hover:bg-stone-100 transition-colors shadow-2xs cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Vložit obrázek do článku</span>
            </button>
          </div>
        )}

        {/* Tags Section */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              <span>Témata & štítky:</span>
            </span>
            {post.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 font-medium shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onBackToBlog}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zpět do archivu blogu</span>
          </button>
        </div>

        {/* Author Bio Card */}
        <div className="mt-12 p-6 sm:p-8 bg-white rounded-2xl border-2 border-[#D5E2EC] shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <a
            href="https://www.instagram.com/neztrat_se_v_info"
            target="_blank"
            rel="noopener noreferrer"
            title="Sledovat @neztrat_se_v_info na Instagramu"
            className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#34D399] via-[#78C0E0] to-[#0C1E34] shrink-0 shadow-md hover:scale-105 transition-transform block"
          >
            <img
              src={author.photoUrl}
              alt={author.name}
              className="w-full h-full rounded-full object-cover bg-[#0A192F]"
            />
          </a>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-[#0C1E34]">
                <InlineText
                  value={author.name}
                  onSave={(val) => onUpdateManifest?.({ authorName: val })}
                  isAdmin={isAdmin && Boolean(onUpdateManifest)}
                  label="Jméno autorky v medailonku"
                />
              </h3>
              <span className="text-xs text-[#0C1E34]/80 font-mono font-medium">
                (
                <InlineText
                  value={author.location}
                  onSave={(val) => onUpdateManifest?.({ authorLocation: val })}
                  isAdmin={isAdmin && Boolean(onUpdateManifest)}
                  label="Lokalita v medailonku"
                />
                )
              </span>
            </div>
            <p className="text-xs text-[#0C1E34] font-medium">
              <InlineText
                value={author.role}
                onSave={(val) => onUpdateManifest?.({ authorRole: val })}
                isAdmin={isAdmin && Boolean(onUpdateManifest)}
                label="Role / zaměření v medailonku"
              />
            </p>
            <div className="text-xs text-slate-600 leading-relaxed pt-1">
              <InlineText
                as="div"
                value={getSiteText(
                  siteTexts,
                  'article.authorBio',
                  'High-tech akademický profil informační vědy. Zkoumám hluboké čtení, digitální kurátorství, mediální gramotnost a etické rozhraní lidského myšlení s AI. Hledej kontext.'
                )}
                onSave={(val) => onUpdateSiteText?.('article.authorBio', val)}
                isAdmin={isAdmin}
                multiline
                rows={3}
                label="Text v autorském medailonku"
              />
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!isAdmin) onBackToHome();
                }}
                className="text-xs font-semibold text-[#0C1E34] hover:text-[#10B981] underline cursor-pointer transition-colors"
              >
                <InlineText
                  value={getSiteText(
                    siteTexts,
                    'article.authorManifestLink',
                    'Prohlédnout osobní manifest a časovou osu →'
                  )}
                  onSave={(val) => onUpdateSiteText?.('article.authorManifestLink', val)}
                  isAdmin={isAdmin}
                  label="Odkaz na manifest v medailonku"
                />
              </button>
              <span className="text-slate-300">·</span>
              <a
                href="https://www.instagram.com/neztrat_se_v_info"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (isAdmin) e.preventDefault();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E1306C] hover:underline transition-colors"
                title="Sledovat InfoStratég na Instagramu"
              >
                <Instagram className="w-3.5 h-3.5" />
                <InlineText
                  value={getSiteText(
                    siteTexts,
                    'article.authorInstagramLabel',
                    'Instagram @neztrat_se_v_info'
                  )}
                  onSave={(val) => onUpdateSiteText?.('article.authorInstagramLabel', val)}
                  isAdmin={isAdmin}
                  label="Instagram odkaz v medailonku"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                  Další čtení
                </span>
                <h3 className="text-2xl font-bold text-stone-950 font-serif">
                  Doporučené články z blogu
                </h3>
              </div>
              <button
                type="button"
                onClick={onBackToBlog}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 underline cursor-pointer"
              >
                Všechny články ({allPosts.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <div
                  key={rPost.id}
                  onClick={() => onOpenPost(rPost.id)}
                  className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:border-stone-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/10 w-full overflow-hidden bg-stone-200">
                      <img
                        src={rPost.imageUrl}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                        <span className="font-semibold text-stone-800">
                          {getPostTopics(rPost).join(' · ')}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">|</span>
                        <span>{rPost.readTime}</span>
                      </div>
                      <h4 className="font-bold text-base text-stone-900 group-hover:text-stone-700 line-clamp-2 leading-snug">
                        {rPost.title}
                      </h4>
                      <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
                        {rPost.annotation}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 sm:p-5 pt-0 pb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 group-hover:translate-x-1 transition-transform">
                      <span>Číst článek</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Insert / Edit Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setImageModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>{editingImageIdx !== null ? 'Upravit obrázek v článku' : 'Vložit obrázek do článku'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview & URL input */}
            <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={imageUrlDraft}
                alt="Náhled"
                className="w-20 h-16 object-cover rounded-lg border border-stone-300 shadow-2xs shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={imageUrlDraft}
                  onChange={(e) => setImageUrlDraft(e.target.value)}
                  placeholder="URL adresa obrázku..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-mono"
                />
                <label className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-950 font-semibold cursor-pointer underline">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Nahrát foto z počítače nebo mobilu</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Popisek k obrázku (bude zobrazen kurzívou pod obrázkem):
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="např. Schéma procesu ověřování faktů v digitálním prostředí"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg text-stone-900"
              />
            </div>

            {/* Presets selection */}
            <div>
              <span className="text-xs font-semibold text-stone-600 block mb-2">
                Nebo vyberte z dostupných fotografií:
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-stone-200 rounded-xl">
                {PRESET_PORTFOLIO_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrlDraft(img.url)}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                      imageUrlDraft === img.url
                        ? 'border-emerald-500 bg-emerald-50 text-stone-900 font-semibold'
                        : 'border-stone-200 hover:border-stone-400 bg-white text-stone-700'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-8 h-8 object-cover rounded shrink-0 border border-stone-200"
                    />
                    <span className="line-clamp-2 text-[10px]">{img.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="button"
                onClick={handleSaveImageToContent}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
              >
                {editingImageIdx !== null ? 'Uložit změny obrázku' : 'Vložit obrázek do článku'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
