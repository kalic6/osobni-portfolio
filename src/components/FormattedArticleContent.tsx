import React from 'react';
import { Bold, Italic, Heading3, Quote, List, ListOrdered, Highlighter, Link as LinkIcon, Image as ImageIcon, HelpCircle } from 'lucide-react';

interface FormatToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (newValue: string) => void;
}

export function FormatToolbar({ textareaRef, value, onChange }: FormatToolbarProps) {
  const applyFormat = (prefix: string, suffix: string = '', defaultText: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      const newCursorStart = start + prefix.length;
      const newCursorEnd = newCursorStart + selectedText.length;
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  };

  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    const lastNewline = before.lastIndexOf('\n');
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const updated = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-stone-100 rounded-lg border border-stone-200 text-xs mb-1.5">
      <span className="text-[10px] font-semibold text-stone-500 uppercase px-1">Formát:</span>
      
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyFormat('**', '**', 'tučný text')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold transition-colors cursor-pointer text-xs"
        title="Tučné písmo (**text**)"
      >
        <Bold className="w-3.5 h-3.5" />
        <span>Tučné</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyFormat('*', '*', 'kurzíva')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 italic transition-colors cursor-pointer text-xs"
        title="Kurzíva (*text*)"
      >
        <Italic className="w-3.5 h-3.5" />
        <span>Kurzíva</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyLinePrefix('### ')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 font-semibold transition-colors cursor-pointer text-xs"
        title="Podnadpis (### Nadpis)"
      >
        <Heading3 className="w-3.5 h-3.5" />
        <span>Podnadpis</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyLinePrefix('> ')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer text-xs"
        title="Citace (> citace)"
      >
        <Quote className="w-3.5 h-3.5" />
        <span>Citace</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyLinePrefix('- ')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer text-xs"
        title="Odrážkový seznam (- položka)"
      >
        <List className="w-3.5 h-3.5" />
        <span>Odrážka</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyLinePrefix('1. ')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer text-xs"
        title="Číslovaný seznam (1. položka)"
      >
        <ListOrdered className="w-3.5 h-3.5" />
        <span>Číslování</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyFormat('==', '==', 'zvýrazněný text')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-amber-900 border border-stone-300 transition-colors cursor-pointer text-xs"
        title="Barevné zvýraznění (==text==)"
      >
        <Highlighter className="w-3.5 h-3.5 text-amber-600" />
        <span>Zvýraznit</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyFormat('[', '](https://)', 'odkaz')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer text-xs"
        title="Hypertextový odkaz ([název](url))"
      >
        <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
        <span>Odkaz</span>
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => applyFormat('![Popis obrázku](', ')', '/src/assets/images/blog_info_literacy_1793721968918.jpg')}
        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer text-xs"
        title="Vložit obrázek do článku (![Popisek](url))"
      >
        <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
        <span>Obrázek</span>
      </button>

      <span className="ml-auto text-[11px] text-stone-500 hidden sm:inline-flex items-center gap-1">
        <HelpCircle className="w-3 h-3 text-stone-400" />
        <span>Podporuje formátování Markdown</span>
      </span>
    </div>
  );
}

/**
 * Parses and renders markdown-like formatted text:
 * - ### Headings
 * - > Blockquotes
 * - - Bullet lists
 * - 1. Numbered lists
 * - **bold**
 * - *italic*
 * - ==highlight==
 * - [text](url)
 */
export function FormattedParagraph({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  const trimmed = text.trim();

  // Image markdown: ![Alt / Popisek](imageUrl)
  const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (imgMatch) {
    const caption = imgMatch[1];
    const src = imgMatch[2];
    return (
      <figure className={`my-8 group/img relative ${className}`}>
        <div className="overflow-hidden rounded-2xl border border-stone-200/90 bg-stone-100 shadow-sm">
          <img
            src={src}
            alt={caption || 'Obrázek v článku'}
            className="w-full max-h-[560px] object-cover"
            loading="lazy"
          />
        </div>
        {caption && (
          <figcaption className="mt-2.5 text-center text-xs sm:text-sm text-stone-500 italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Heading level 1 or 2
  if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
    const content = trimmed.replace(/^#+\s*/, '');
    return (
      <h3 className={`text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-6 mb-2 tracking-tight ${className}`}>
        {renderInlineFormatting(content)}
      </h3>
    );
  }

  // Heading level 3
  if (trimmed.startsWith('### ')) {
    const content = trimmed.replace(/^###\s*/, '');
    return (
      <h4 className={`text-lg sm:text-xl font-serif font-bold text-stone-900 mt-5 mb-2 tracking-tight ${className}`}>
        {renderInlineFormatting(content)}
      </h4>
    );
  }

  // Blockquote
  if (trimmed.startsWith('> ') || trimmed.startsWith('>')) {
    const content = trimmed.replace(/^>\s*/, '');
    return (
      <blockquote className={`border-l-4 border-amber-500 pl-4 py-2 my-4 italic text-stone-800 bg-amber-50/60 rounded-r-xl font-serif text-base sm:text-lg ${className}`}>
        {renderInlineFormatting(content)}
      </blockquote>
    );
  }

  // List item (bullet)
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    const content = trimmed.replace(/^[-*]\s*/, '');
    return (
      <div className={`flex items-start gap-2.5 my-1.5 pl-2 text-stone-700 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
        <span className="flex-1">{renderInlineFormatting(content)}</span>
      </div>
    );
  }

  // Numbered list item
  const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
  if (numMatch) {
    const num = numMatch[1];
    const content = numMatch[2];
    return (
      <div className={`flex items-start gap-2.5 my-1.5 pl-2 text-stone-700 ${className}`}>
        <span className="font-bold text-stone-900 text-sm shrink-0 min-w-[1.2rem]">{num}.</span>
        <span className="flex-1">{renderInlineFormatting(content)}</span>
      </div>
    );
  }

  // Regular paragraph with inline formatting
  return (
    <p className={`leading-relaxed text-stone-700 my-2 ${className}`}>
      {renderInlineFormatting(text)}
    </p>
  );
}

/**
 * Parses inline formatting tags:
 * **bold**, *italic*, ==highlight==, [link](url), `code`
 */
export function renderInlineFormatting(text: string): React.ReactNode {
  // Regex matches:
  // 1: **bold**
  // 2: *italic*
  // 3: ==highlight==
  // 4: [title](url)
  // 5: `code`
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|==[^=]+==|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // **Bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-stone-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // *Italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-stone-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // ==Highlight==
    if (part.startsWith('==') && part.endsWith('==') && part.length >= 4) {
      return (
        <mark key={index} className="bg-amber-100 text-stone-900 px-1 py-0.5 rounded font-medium">
          {part.slice(2, -2)}
        </mark>
      );
    }

    // [Link](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 underline hover:text-amber-950 font-medium cursor-pointer"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // `Code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-800 text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Plain text chunk
    return <span key={index}>{part}</span>;
  });
}
