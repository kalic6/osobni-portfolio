import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import {
  type PortfolioSnapshot,
  ROBOTS_TXT_CONTENT,
  renderJsonLdScript,
  renderLlmsFullTxt,
  renderLlmsTxt,
  renderStaticPortfolioHtml,
} from './scripts/prerenderPortfolio';

function loadPublishedSnapshot(): PortfolioSnapshot {
  const targetPath = path.resolve(__dirname, 'src/data/publishedData.json');
  try {
    const raw = fs.readFileSync(targetPath, 'utf-8');
    return JSON.parse(raw) as PortfolioSnapshot;
  } catch {
    return {};
  }
}

function aiReadablePortfolioPlugin(): Plugin {
  let outDir = path.resolve(__dirname, 'dist');
  return {
    name: 'ai-readable-portfolio',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml(html) {
      const snapshot = loadPublishedSnapshot();
      const jsonLd = renderJsonLdScript(snapshot);
      const staticHtml = renderStaticPortfolioHtml(snapshot);
      const llmsLink = '<link rel="alternate" type="text/plain" title="Obsah webu pro AI (llms.txt)" href="./llms.txt" />';

      let transformed = html.replace('</head>', `    ${llmsLink}\n    ${jsonLd}\n  </head>`);
      transformed = transformed.replace(
        /<div id="root">\s*<\/div>/,
        `<div id="root">\n${staticHtml}\n    </div>`
      );
      return transformed;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0];
        if (cleanUrl === '/llms.txt') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(renderLlmsTxt(loadPublishedSnapshot()));
          return;
        }
        if (cleanUrl === '/llms-full.txt') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(renderLlmsFullTxt(loadPublishedSnapshot()));
          return;
        }
        if (cleanUrl === '/robots.txt') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(ROBOTS_TXT_CONTENT);
          return;
        }
        next();
      });
    },
    closeBundle() {
      const snapshot = loadPublishedSnapshot();
      if (!fs.existsSync(outDir)) return;
      fs.writeFileSync(path.join(outDir, 'llms.txt'), renderLlmsTxt(snapshot), 'utf-8');
      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), renderLlmsFullTxt(snapshot), 'utf-8');
      fs.writeFileSync(path.join(outDir, 'robots.txt'), ROBOTS_TXT_CONTENT, 'utf-8');
    },
  };
}

function persistBase64Images(value: unknown, imagesDir: string): unknown {
  if (typeof value === 'string') {
    const match = value.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/s);
    if (match) {
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      const buffer = Buffer.from(match[2], 'base64');
      const hash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 12);
      if (hash === '34b27bac1d32') {
        return './assets/images/profile_avatar_custom.png';
      }
      const filename = `custom_${hash}.${ext}`;
      const destPath = path.join(imagesDir, filename);
      fs.mkdirSync(imagesDir, { recursive: true });
      if (!fs.existsSync(destPath)) {
        fs.writeFileSync(destPath, buffer);
        if (buffer.length > 900 * 1024) {
          try {
            execFileSync('convert', [destPath, '-resize', '900x900>', '-strip', destPath], {
              stdio: 'ignore',
            });
          } catch {
            // Keep original if ImageMagick is unavailable
          }
        }
      }
      return `./assets/images/${filename}`;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => persistBase64Images(item, imagesDir));
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = persistBase64Images(v, imagesDir);
    }
    return out;
  }
  return value;
}

function savePortfolioToCodePlugin(): Plugin {
  return {
    name: 'save-portfolio-to-code',
    configureServer(server) {
      server.middlewares.use('/__api/save-portfolio', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            const imagesDir = path.resolve(__dirname, 'public/assets/images');
            const cleanPayload = persistBase64Images(parsed, imagesDir);
            const targetPath = path.resolve(__dirname, 'src/data/publishedData.json');
            fs.writeFileSync(targetPath, JSON.stringify(cleanPayload, null, 2) + '\n', 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, data: cleanPayload }));
          } catch (err) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: String(err) }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: './',
    plugins: [react(), tailwindcss(), savePortfolioToCodePlugin(), aiReadablePortfolioPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
