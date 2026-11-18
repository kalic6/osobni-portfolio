import { useState, useRef, useEffect, type ElementType } from 'react';
import { Check, X, Camera, Pencil, Upload, Trash2 } from 'lucide-react';
import { FormatToolbar, FormattedParagraph, renderInlineFormatting } from './FormattedArticleContent';

interface InlineTextProps {
  value: string;
  onSave: (val: string) => void;
  onDelete?: () => void;
  deleteConfirmPrompt?: string;
  isAdmin: boolean;
  className?: string;
  as?: ElementType;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  label?: string;
}

export function InlineText({
  value,
  onSave,
  onDelete,
  deleteConfirmPrompt,
  isAdmin,
  className = '',
  as: Component = 'span',
  placeholder = 'Klikněte pro zadání textu...',
  multiline = false,
  rows = 3,
  label,
}: InlineTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
    setConfirmingDelete(false);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      setConfirmingDelete(false);
      if (multiline && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
        // Auto resize height
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 8}px`;
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isEditing, multiline]);

  if (!isAdmin) {
    if (!value) return null;
    if (multiline && Component !== 'span') {
      return <FormattedParagraph text={value} className={className} />;
    }
    return <Component className={className}>{renderInlineFormatting(value)}</Component>;
  }

  const handleCommit = () => {
    const trimmed = draft.trim();
    if (trimmed === '' && onDelete) {
      onDelete();
      setIsEditing(false);
      return;
    }
    if (trimmed !== value) {
      onSave(trimmed);
    }
    setIsEditing(false);
    setConfirmingDelete(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
    setConfirmingDelete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter') {
      if (!multiline) {
        e.preventDefault();
        handleCommit();
      } else if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        handleCommit();
      }
    }
  };

  if (isEditing) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative inline-block w-full my-1 z-30 animate-in fade-in duration-150"
      >
        {label && (
          <span className="block text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">
            {label}
          </span>
        )}
        {multiline && (
          <FormatToolbar
            textareaRef={textareaRef}
            value={draft}
            onChange={(newVal) => {
              setDraft(newVal);
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 8}px`;
              }
            }}
          />
        )}
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={draft}
            rows={rows}
            onChange={(e) => {
              setDraft(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight + 8}px`;
            }}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className={`w-full p-2.5 bg-amber-50/90 text-stone-900 border-2 border-amber-500 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 font-inherit leading-relaxed ${className}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            className={`w-full px-2.5 py-1.5 bg-amber-50/90 text-stone-900 border-2 border-amber-500 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 font-inherit ${className}`}
            placeholder={placeholder}
          />
        )}
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-stone-500 flex-wrap">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-stone-900 text-white rounded text-[10px] font-medium">
            {multiline ? 'Cmd/Ctrl + Enter' : 'Enter'} = Uložit
          </span>
          <span>Esc = Zrušit</span>

          {/* Quick Clear Text Button */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setDraft('');
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-200 text-stone-700 hover:bg-stone-300 rounded text-[11px] font-medium transition-colors cursor-pointer"
            title="Smazat veškerý text v poli"
          >
            <span>Vymazat text</span>
          </button>

          {onDelete && (
            confirmingDelete ? (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-100 text-red-800 rounded border border-red-300 text-[11px] font-semibold animate-in fade-in">
                <span>Opravdu smazat?</span>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                    setIsEditing(false);
                    setConfirmingDelete(false);
                  }}
                  className="px-1.5 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer font-bold text-[10px]"
                >
                  Ano, smazat
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmingDelete(false);
                  }}
                  className="px-1 py-0.5 text-stone-600 hover:text-stone-900 cursor-pointer text-[10px]"
                >
                  Ne
                </button>
              </div>
            ) : (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirmingDelete(true);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 hover:bg-red-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                title="Smazat tento prvek"
              >
                <Trash2 className="w-3 h-3" />
                <span>Smazat prvek</span>
              </button>
            )
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommit();
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-700 text-white rounded text-[11px] hover:bg-emerald-800 transition-colors cursor-pointer font-medium"
            >
              <Check className="w-3 h-3" />
              <span>Uložit</span>
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-200 text-stone-700 rounded text-[11px] hover:bg-stone-300 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin view when value is empty/cleared
  if (!value) {
    return (
      <Component
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        title="Kliknutím vložíte text"
        className={`${className} cursor-pointer transition-all rounded px-2 py-0.5 border border-dashed border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-800 text-xs inline-flex items-center gap-1.5 group/inline select-none my-0.5`}
      >
        <span className="italic font-normal">
          {placeholder || `+ Přidat text (${label || 'klikněte'})`}
        </span>
        <Pencil className="w-3 h-3 text-amber-600 shrink-0" />
        {onDelete && (
          confirmingDelete ? (
            <span
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-800 rounded border border-red-300 text-[10px] font-semibold"
            >
              <span>Smazat?</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setConfirmingDelete(false);
                }}
                className="font-bold underline text-red-700"
              >
                Ano
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingDelete(false);
                }}
                className="text-stone-500"
              >
                Ne
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmingDelete(true);
              }}
              title="Smazat tento prvek"
              className="p-0.5 hover:text-red-600 hover:bg-red-100 rounded cursor-pointer"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          )
        )}
      </Component>
    );
  }

  return (
    <Component
      onClick={(e: React.MouseEvent) => {
        // Prevent link navigations if inside <a> or parent clicks
        e.stopPropagation();
        setIsEditing(true);
      }}
      title="Kliknutím upravíte tento text"
      className={`${className} cursor-text transition-all rounded px-0.5 -mx-0.5 outline-1 outline-dashed outline-transparent hover:outline-amber-400 hover:bg-amber-500/20 relative group/inline`}
    >
      {multiline && Component !== 'span' ? (
        <FormattedParagraph text={value} />
      ) : (
        renderInlineFormatting(value)
      )}
      <span
        className={`opacity-0 group-hover/inline:opacity-100 transition-opacity inline-flex items-center gap-1 text-amber-500 ${
          multiline && Component !== 'span'
            ? 'absolute top-1.5 right-1.5 bg-amber-50/95 border border-amber-200 px-1.5 py-0.5 rounded-md shadow-2xs'
            : 'ml-1.5 align-baseline'
        }`}
      >
        <Pencil className="w-3 h-3 inline-block" />
        {onDelete && (
          confirmingDelete ? (
            <span
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-50 text-red-700 border border-red-300 rounded text-[11px] font-semibold shadow-xs"
            >
              <span>Smazat?</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setConfirmingDelete(false);
                }}
                className="px-1 py-0.2 bg-red-600 text-white rounded hover:bg-red-700 font-bold cursor-pointer text-[10px]"
              >
                Ano
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmingDelete(false);
                }}
                className="px-1 py-0.2 text-stone-600 hover:text-stone-900 cursor-pointer text-[10px]"
              >
                Ne
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmingDelete(true);
              }}
              title="Smazat tento prvek"
              className="p-0.5 hover:text-red-400 hover:bg-red-500/20 rounded cursor-pointer"
            >
              <Trash2 className="w-3 h-3 inline-block" />
            </button>
          )
        )}
      </span>
    </Component>
  );
}

// Preset images available in app
export const PRESET_PORTFOLIO_IMAGES = [
  { label: 'InfoStratég – Osobní avatar (ilustrace)', url: './assets/images/profile_avatar_custom.png' },
  { label: 'InfoStratég – Profilový kompas', url: './assets/aistudio/profile_picture_c1a456ff.jpeg' },
  { label: 'InfoStratég – Brand vizuál & Moodboard', url: './assets/aistudio/vizual_navrh2_504def8a.jpeg' },
  { label: 'Původní portrét (Káťa Kalivodová)', url: './assets/images/portrait_kata_manifest_1793720229771.jpg' },
  { label: 'Otevřený sešit & výzkum', url: './assets/images/blog_info_literacy_1793721968918.jpg' },
  { label: 'Digitální data & poznámky', url: './assets/images/blog_digital_wellbeing_1793721966575.jpg' },
  { label: 'Knihy a čtení', url: './assets/images/interest_books_reading_1793720231318.jpg' },
  { label: 'Analogová fotografie', url: './assets/images/interest_analog_photo_1793720230936.jpg' },
  { label: 'Horský hřeben', url: './assets/images/interest_mountain_hiking_1793720233561.jpg' },
  { label: 'Kreativní workshop', url: './assets/images/interest_community_workshop_1793720232486.jpg' },
];

interface InlineImageProps {
  src: string;
  alt: string;
  onSave: (newUrl: string) => void;
  isAdmin: boolean;
  className?: string;
  aspectClass?: string;
}

export function InlineImage({
  src,
  alt,
  onSave,
  isAdmin,
  className = '',
  aspectClass = 'aspect-square',
}: InlineImageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);

  useEffect(() => {
    setUrlDraft(src);
  }, [src]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setUrlDraft(result);
        onSave(result);
        setModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUrl = () => {
    if (urlDraft.trim()) {
      onSave(urlDraft.trim());
      setModalOpen(false);
    }
  };

  return (
    <div className={`relative group/img ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${aspectClass}`}
      />

      {isAdmin && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
            title="Kliknutím změníte fotografii"
            className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-4 cursor-pointer backdrop-blur-[2px] z-10"
          >
            <Camera className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-semibold px-2.5 py-1 bg-stone-900/90 rounded-md border border-stone-700">
              Změnit fotografii
            </span>
          </button>

          {/* Image Picker Modal */}
          {modalOpen && (
            <div
              className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(false);
              }}
            >
              <div
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-stone-900 space-y-4 animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Změnit fotografii</span>
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Current Preview */}
                <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <img
                    src={urlDraft || src}
                    alt="Náhled"
                    className="w-16 h-16 object-cover rounded-lg border border-stone-300 shadow-2xs"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={urlDraft}
                      onChange={(e) => setUrlDraft(e.target.value)}
                      placeholder="URL adresa obrázku..."
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900"
                    />
                    <label className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-950 font-semibold cursor-pointer underline">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Nahrát z počítače nebo mobilu</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Options */}
                <div>
                  <span className="text-xs font-semibold text-stone-600 block mb-2">
                    Nebo vyberte z předpřipravených fotek:
                  </span>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                    {PRESET_PORTFOLIO_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setUrlDraft(img.url);
                          onSave(img.url);
                          setModalOpen(false);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                          urlDraft === img.url
                            ? 'border-amber-500 bg-amber-50 text-stone-900 font-semibold'
                            : 'border-stone-200 hover:border-stone-400 bg-white text-stone-700'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-8 h-8 object-cover rounded shrink-0 border border-stone-200"
                        />
                        <span className="line-clamp-2 text-[11px]">{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Zavřít
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveUrl}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Použít zadanou URL
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
