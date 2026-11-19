interface ManifestPoint {
  id: string;
  title: string;
  description: string;
}

interface AiPrinciple {
  id: string;
  category?: string;
  title: string;
  description: string;
}

interface TimelineItem {
  id: string;
  phaseLabel?: string;
  timePeriod: string;
  title: string;
  subtitle?: string;
  organization?: string;
  location?: string;
  description: string;
  personalReflection?: string;
  keyHighlights?: string[];
  tags?: string[];
}

interface StudyCourse {
  id: string;
  code: string;
  title: string;
  semester: string;
  academicYear: string;
  institution: string;
  credits: number;
  status: string;
  comment: string;
  competencies?: string[];
  keyProject?: string;
}

interface WorkExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  type: string;
  summary: string;
  comment: string;
  achievements?: string[];
  skills?: string[];
}

interface BlogPost {
  id: string;
  title: string;
  topic: string;
  topics?: string[];
  date: string;
  readTime: string;
  imageUrl?: string;
  annotation: string;
  featuredQuote?: string;
  content: string[];
  tags?: string[];
}

interface InterestItem {
  id: string;
  title: string;
  category: string;
  activityFrequency: string;
  personalNote: string;
  tags?: string[];
}

export interface PortfolioSnapshot {
  siteTexts?: Record<string, string>;
  manifest?: {
    authorName?: string;
    authorRole?: string;
    authorEmail?: string;
    authorLocation?: string;
    photoUrl?: string;
    heroHeadline?: string;
    heroSubhead?: string;
    manifestQuote?: string;
    manifestPillars?: ManifestPoint[];
    aiPrinciples?: AiPrinciple[];
    fullManifestText?: string[];
  };
  timeline?: TimelineItem[];
  courses?: StudyCourse[];
  experiences?: WorkExperience[];
  posts?: BlogPost[];
  interests?: InterestItem[];
}

const SITE_BASE_URL = 'https://kalic6.github.io/osobni-portfolio/';

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugifyCzech(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getPostTopics(post: BlogPost): string[] {
  const list =
    Array.isArray(post.topics) && post.topics.length > 0
      ? post.topics
      : post.topic
        ? [post.topic]
        : [];
  return Array.from(new Set(list.map((t) => t.trim()).filter(Boolean)));
}

function inlineMarkdownToHtml(text: string): string {
  let out = escapeHtml(text);
  // [label](url)
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  // **bold**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // *italic*
  out = out.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  return out;
}

function stripMarkdownForPlainText(text: string): string {
  return (text || '')
    .replace(/^!\[[^\]]*\]\([^)]+\)\s*$/gm, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim();
}

function renderArticleContentHtml(blocks: string[]): string {
  const htmlParts: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      htmlParts.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`).join('')}</ul>`);
      listItems = [];
    }
  };

  for (const rawBlock of blocks || []) {
    const block = (rawBlock || '').trim();
    if (!block) continue;

    if (block.startsWith('- ') || block.startsWith('* ')) {
      const lines = block.split('\n').map((l) => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
      listItems.push(...lines);
      continue;
    }

    flushList();

    const imgMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const alt = escapeHtml(imgMatch[1] || 'Ilustrace článku');
      const src = escapeHtml(imgMatch[2]);
      htmlParts.push(`<figure><img src="${src}" alt="${alt}" loading="lazy" /></figure>`);
      continue;
    }

    if (block.startsWith('### ')) {
      htmlParts.push(`<h5>${inlineMarkdownToHtml(block.slice(4))}</h5>`);
    } else if (block.startsWith('## ')) {
      htmlParts.push(`<h4>${inlineMarkdownToHtml(block.slice(3))}</h4>`);
    } else if (block.startsWith('# ')) {
      htmlParts.push(`<h3>${inlineMarkdownToHtml(block.slice(2))}</h3>`);
    } else {
      htmlParts.push(`<p>${inlineMarkdownToHtml(block)}</p>`);
    }
  }

  flushList();
  return htmlParts.join('\n');
}

export function renderJsonLdScript(data: PortfolioSnapshot, siteUrl = SITE_BASE_URL): string {
  const m = data.manifest || {};
  const t = data.siteTexts || {};
  const posts = data.posts || [];

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': `${siteUrl}#person`,
      name: m.authorName || 'Kateřina Kalivodová',
      alternateName: ['@neztrat_se_v_info', t['header.brand'] || 'InfoStratég'],
      jobTitle: m.authorRole || 'Práce s informacemi · Informační gramotnost',
      description: m.heroSubhead || '',
      email: m.authorEmail ? `mailto:${m.authorEmail}` : undefined,
      address: m.authorLocation
        ? {
            '@type': 'PostalAddress',
            addressLocality: m.authorLocation,
          }
        : undefined,
      sameAs: ['https://www.instagram.com/neztrat_se_v_info'],
      url: siteUrl,
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      name: m.heroHeadline || 'Od informačního chaosu k porozumění a kontextu',
      description: m.heroSubhead || '',
      url: siteUrl,
      inLanguage: 'cs',
      author: { '@id': `${siteUrl}#person` },
    },
    ...posts.map((post) => {
      const slug = slugifyCzech(post.title) || slugifyCzech(post.id) || post.id;
      const bodyText = (post.content || [])
        .map(stripMarkdownForPlainText)
        .filter(Boolean)
        .join('\n\n');
      return {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.annotation,
        articleSection: getPostTopics(post),
        keywords: (post.tags || []).join(', '),
        url: `${siteUrl}#/blog/${slug}`,
        inLanguage: 'cs',
        author: { '@id': `${siteUrl}#person` },
        articleBody: bodyText,
      };
    }),
  ];

  const payload = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  }).replace(/</g, '\\u003c');

  return `<script type="application/ld+json">${payload}</script>`;
}

export function renderStaticPortfolioHtml(data: PortfolioSnapshot): string {
  const m = data.manifest || {};
  const t = data.siteTexts || {};
  const pillars = m.manifestPillars || [];
  const aiPrinciples = m.aiPrinciples || [];
  const timeline = data.timeline || [];
  const courses = data.courses || [];
  const experiences = data.experiences || [];
  const posts = data.posts || [];
  const interests = data.interests || [];

  return `
<main id="static-portfolio-content" data-prerender="true" style="max-width:56rem;margin:0 auto;padding:2.5rem 1.25rem;font-family:'Open Sans',system-ui,sans-serif;color:#0C1E34;line-height:1.65;">
  <header style="border-bottom:1px solid #D5E2EC;padding-bottom:1.5rem;margin-bottom:2rem;">
    <p style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.06em;color:#475569;margin:0 0 0.5rem;">
      ${escapeHtml(t['hero.kickerLeft'] || 'Osobní portfolio')} · ${escapeHtml(m.authorName || 'Kateřina Kalivodová')} (@neztrat_se_v_info)
    </p>
    <h1 style="font-size:2rem;line-height:1.2;font-weight:700;margin:0 0 1rem;">
      ${escapeHtml(m.heroHeadline || 'Od informačního chaosu k porozumění a kontextu')}
    </h1>
    <p style="font-size:1.1rem;color:#334155;margin:0 0 1rem;">
      ${escapeHtml(m.heroSubhead || '')}
    </p>
    ${
      m.manifestQuote
        ? `<blockquote style="border-left:3px solid #34D399;padding-left:1rem;margin:1rem 0;font-style:italic;color:#1E293B;">„${escapeHtml(m.manifestQuote)}“</blockquote>`
        : ''
    }
    <nav aria-label="Navigace portfolia" style="margin-top:1rem;font-size:0.9rem;">
      <a href="#uvod">Úvod &amp; Manifest</a> ·
      <a href="#timeline">Časová osa</a> ·
      <a href="#/studium">Studium</a> ·
      <a href="#/zkusenosti">Zkušenosti</a> ·
      <a href="#/blog">Blog</a> ·
      <a href="./llms.txt">Obsah pro AI (llms.txt)</a>
    </nav>
  </header>

  <section id="prerender-manifest" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['hero.modalManifestTitle'] || 'Osobní manifest')}</h2>
    ${(m.fullManifestText || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('\n    ')}
  </section>

  <section id="prerender-pillars" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['hero.pillarsTitle'] || 'Čtyři pilíře mého přístupu k informacím')}</h2>
    <p>${escapeHtml(t['hero.pillarsSubtitle'] || '')}</p>
    <ul>
      ${pillars
        .map(
          (p) =>
            `<li><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.description)}</p></li>`
        )
        .join('\n      ')}
    </ul>
  </section>

  <section id="prerender-ai" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['aiPrinciples.title'] || 'Mé zásady při práci s umělou inteligencí')}</h2>
    <p>${escapeHtml(t['aiPrinciples.subtitle'] || '')}</p>
    <ul>
      ${aiPrinciples
        .map(
          (a) =>
            `<li>${a.category ? `<span>${escapeHtml(a.category)}: </span>` : ''}<strong>${escapeHtml(a.title)}</strong> – ${escapeHtml(a.description)}</li>`
        )
        .join('\n      ')}
    </ul>
  </section>

  <section id="prerender-timeline" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['timeline.title'] || 'Odkud jdu, kde jsem a kam směřuji')}</h2>
    <p>${escapeHtml(t['timeline.subtitle'] || '')}</p>
    ${timeline
      .map(
        (item) => `
    <article style="margin-bottom:1.25rem;">
      <h3>${escapeHtml(item.title)} (${escapeHtml(item.timePeriod)}${item.phaseLabel ? ` · ${escapeHtml(item.phaseLabel)}` : ''})</h3>
      ${item.subtitle || item.organization || item.location ? `<p><strong>${escapeHtml([item.subtitle, item.organization, item.location].filter(Boolean).join(' · '))}</strong></p>` : ''}
      <p>${escapeHtml(item.description)}</p>
      ${item.personalReflection ? `<p>${escapeHtml(item.personalReflection)}</p>` : ''}
      ${item.keyHighlights && item.keyHighlights.length ? `<ul>${item.keyHighlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>` : ''}
    </article>`
      )
      .join('')}
  </section>

  <section id="prerender-study" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['study.title'] || 'Studium a odborné předměty')}</h2>
    <p>${escapeHtml(t['study.subtitle'] || '')}</p>
    ${courses
      .map(
        (c) => `
    <article style="margin-bottom:1rem;">
      <h3>${escapeHtml(c.code)} – ${escapeHtml(c.title)} (${escapeHtml(c.semester)} ${escapeHtml(c.academicYear)}, ${escapeHtml(c.status)})</h3>
      <p>${escapeHtml(c.institution)} · ${c.credits} kreditů</p>
      <p>${escapeHtml(c.comment)}</p>
      ${c.keyProject ? `<p>Projekt: ${escapeHtml(c.keyProject)}</p>` : ''}
    </article>`
      )
      .join('')}
  </section>

  <section id="prerender-experience" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['experience.title'] || 'Pracovní zkušenosti')}</h2>
    <p>${escapeHtml(t['experience.subtitle'] || '')}</p>
    ${experiences
      .map(
        (exp) => `
    <article style="margin-bottom:1.25rem;">
      <h3>${escapeHtml(exp.role)} – ${escapeHtml(exp.organization)} (${escapeHtml(exp.period)}, ${escapeHtml(exp.location)})</h3>
      <p>${escapeHtml(exp.summary)}</p>
      <p>${escapeHtml(exp.comment)}</p>
    </article>`
      )
      .join('')}
  </section>

  <section id="prerender-blog" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['blog.titleArchive'] || 'Blog ze světa informací')}</h2>
    <p>${escapeHtml(t['blog.subtitleArchive'] || '')}</p>
    ${posts
      .map((post) => {
        const slug = slugifyCzech(post.title) || slugifyCzech(post.id) || post.id;
        const postTopics = getPostTopics(post).join(', ');
        return `
    <article style="margin-bottom:2rem;padding-top:1rem;border-top:1px solid #E2E8F0;">
      <h3><a href="#/blog/${escapeHtml(slug)}">${escapeHtml(post.title)}</a></h3>
      <p><small>${escapeHtml(post.date)} · ${escapeHtml(post.readTime)}${postTopics ? ` · Témata: ${escapeHtml(postTopics)}` : ''}</small></p>
      <p><strong>${escapeHtml(post.annotation)}</strong></p>
      ${post.featuredQuote ? `<blockquote>„${escapeHtml(post.featuredQuote)}“</blockquote>` : ''}
      <div>${renderArticleContentHtml(post.content || [])}</div>
    </article>`;
      })
      .join('')}
  </section>

  <section id="prerender-interests" style="margin-bottom:2.5rem;">
    <h2>${escapeHtml(t['interests.titleHome'] || 'Zájmy a volný čas')}</h2>
    <ul>
      ${interests
        .map(
          (i) =>
            `<li><strong>${escapeHtml(i.title)}</strong> (${escapeHtml(i.category)}): ${escapeHtml(i.personalNote)}</li>`
        )
        .join('\n      ')}
    </ul>
  </section>

  <footer style="border-top:1px solid #D5E2EC;padding-top:1rem;font-size:0.9rem;color:#475569;">
    <p>${escapeHtml(m.authorName || 'Kateřina Kalivodová')} · ${escapeHtml(m.authorRole || '')} · ${escapeHtml(m.authorLocation || '')}</p>
    <p>Instagram: <a href="https://www.instagram.com/neztrat_se_v_info">@neztrat_se_v_info</a>${m.authorEmail ? ` · E-mail: <a href="mailto:${escapeHtml(m.authorEmail)}">${escapeHtml(m.authorEmail)}</a>` : ''}</p>
  </footer>
</main>`.trim();
}

export function renderLlmsTxt(data: PortfolioSnapshot, siteUrl = SITE_BASE_URL): string {
  const m = data.manifest || {};
  const posts = data.posts || [];
  const lines = [
    `# ${m.heroHeadline || 'Od informačního chaosu k porozumění a kontextu'}`,
    '',
    `> Osobní portfolio a blog autorky ${m.authorName || 'Kateřina Kalivodová'} (@neztrat_se_v_info) věnované práci s informacemi, informačním sítím, informační gramotnosti a studiu informačních studií a knihovnictví.`,
    '',
    `Web: ${siteUrl}`,
    `Kompletní textový export pro AI: ${siteUrl}llms-full.txt`,
    `Instagram: https://www.instagram.com/neztrat_se_v_info`,
    m.authorEmail ? `Kontakt: ${m.authorEmail}` : '',
    '',
    '## Sekce portfolia',
    `- Úvod a manifest: ${siteUrl}`,
    `- Časová osa: ${siteUrl}#timeline`,
    `- Studium a absolvované předměty: ${siteUrl}#/studium`,
    `- Pracovní zkušenosti: ${siteUrl}#/zkusenosti`,
    `- Blog a eseje: ${siteUrl}#/blog`,
    '',
    '## Články na blogu',
    ...posts.map((post) => {
      const slug = slugifyCzech(post.title) || slugifyCzech(post.id) || post.id;
      const topics = getPostTopics(post).join(', ');
      return `- [${post.title}](${siteUrl}#/blog/${slug}) (${post.date}${topics ? ` · ${topics}` : ''}): ${post.annotation}`;
    }),
    '',
    '## Kompletní obsah',
    `Pro plné znění manifestu, pilířů, zásad AI, časové osy, studia, zkušeností i celých blogových článků viz ${siteUrl}llms-full.txt`,
  ].filter((line) => line !== undefined);

  return lines.join('\n').trim() + '\n';
}

export function renderLlmsFullTxt(data: PortfolioSnapshot, siteUrl = SITE_BASE_URL): string {
  const m = data.manifest || {};
  const t = data.siteTexts || {};
  const pillars = m.manifestPillars || [];
  const aiPrinciples = m.aiPrinciples || [];
  const timeline = data.timeline || [];
  const courses = data.courses || [];
  const experiences = data.experiences || [];
  const posts = data.posts || [];
  const interests = data.interests || [];

  const parts: string[] = [
    `# ${m.heroHeadline || 'Od informačního chaosu k porozumění a kontextu'}`,
    `Autorka: ${m.authorName || 'Kateřina Kalivodová'} (@neztrat_se_v_info)`,
    `Zaměření: ${m.authorRole || ''}`,
    `Lokalita: ${m.authorLocation || ''}`,
    m.authorEmail ? `E-mail: ${m.authorEmail}` : '',
    `Web: ${siteUrl}`,
    '',
    m.heroSubhead || '',
    m.manifestQuote ? `\n> „${m.manifestQuote}“` : '',
    '',
    `## ${t['hero.modalManifestTitle'] || 'Manifest'}`,
    ...(m.fullManifestText || []),
    '',
    `## ${t['hero.pillarsTitle'] || 'Čtyři pilíře mého přístupu k informacím'}`,
    ...pillars.map((p) => `- **${p.title}**: ${p.description}`),
    '',
    `## ${t['aiPrinciples.title'] || 'Mé zásady při práci s umělou inteligencí'}`,
    t['aiPrinciples.subtitle'] || '',
    ...aiPrinciples.map((a) => `- **${a.title}** (${a.category || 'Zásada'}): ${a.description}`),
    '',
    `## ${t['timeline.title'] || 'Časová osa'}`,
    ...timeline.map((item) => {
      const meta = [item.timePeriod, item.phaseLabel, item.subtitle, item.organization, item.location]
        .filter(Boolean)
        .join(' · ');
      const highlights = (item.keyHighlights || []).map((h) => `  - ${h}`).join('\n');
      return [
        `### ${item.title} (${meta})`,
        item.description,
        item.personalReflection || '',
        highlights,
      ]
        .filter(Boolean)
        .join('\n');
    }),
    '',
    `## ${t['study.title'] || 'Studium a odborné předměty'}`,
    ...courses.map(
      (c) =>
        `### ${c.code} – ${c.title} (${c.semester} ${c.academicYear}, ${c.status})\n${c.institution}, ${c.credits} kr.\n${c.comment}${c.keyProject ? `\nProjekt: ${c.keyProject}` : ''}`
    ),
    '',
    `## ${t['experience.title'] || 'Pracovní zkušenosti'}`,
    ...experiences.map(
      (e) =>
        `### ${e.role} – ${e.organization} (${e.period}, ${e.location})\n${e.summary}\n${e.comment}`
    ),
    '',
    `## ${t['blog.titleArchive'] || 'Blogové články'}`,
    ...posts.map((post) => {
      const slug = slugifyCzech(post.title) || slugifyCzech(post.id) || post.id;
      const body = (post.content || [])
        .map(stripMarkdownForPlainText)
        .filter(Boolean)
        .join('\n\n');
      return [
        `### ${post.title}`,
        `URL: ${siteUrl}#/blog/${slug}`,
        `Datum: ${post.date} | Doba čtení: ${post.readTime} | Témata: ${getPostTopics(post).join(', ')}`,
        `Anotace: ${post.annotation}`,
        post.featuredQuote ? `Klíčová myšlenka: „${post.featuredQuote}“` : '',
        '',
        body,
      ]
        .filter((l) => l !== undefined && l !== '')
        .join('\n');
    }),
    '',
    `## ${t['interests.titleHome'] || 'Zájmy a volný čas'}`,
    ...interests.map((i) => `- **${i.title}** (${i.category}): ${i.personalNote}`),
  ];

  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export const ROBOTS_TXT_CONTENT = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
`;
