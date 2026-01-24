#!/usr/bin/env node

/**
 * QA Media Checker
 *
 * Scans all generated HTML in dist/ directories and verifies that every
 * external media URL (MP3, PDF, images on static.*) actually exists (HTTP 200).
 *
 * Usage:
 *   node packages/core/scripts/qa-check-media.js [--package <name>] [--fix-report]
 *
 * Options:
 *   --package <name>   Only check a specific package (todo, sanacion, jesus, eluno, doctrinas)
 *   --fix-report       Generate a fix-report.json with actionable repair data
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ─── Configuration ───────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const PACKAGES_DIR = path.join(PROJECT_ROOT, 'packages');
const PACKAGES = ['todo', 'sanacion', 'jesus', 'eluno', 'doctrinas'];

const URL_PATTERNS = [
  /https?:\/\/[^"'\s<>]+\.mp3/g,
  /https?:\/\/[^"'\s<>]+\.pdf/g,
  /https?:\/\/[^"'\s<>]+\.css[^"'\s<>]*/g,
  /https?:\/\/[^"'\s<>]+\.woff2?/g,
  /https?:\/\/[^"'\s<>]+\.jpg/g,
  /https?:\/\/[^"'\s<>]+\.png/g,
  /https?:\/\/[^"'\s<>]+\.webp/g,
];

// Also catch relative audio/pdf refs that resolve to static domain
const STATIC_URL_PATTERN = /https?:\/\/static[^"'\s<>]+/g;

// ─── CLI Args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const packageFilter = args.includes('--package') ? args[args.indexOf('--package') + 1] : null;
const generateFixReport = args.includes('--fix-report');

// ─── URL Checker ─────────────────────────────────────────────────────────────

const urlCache = new Map();
const CONCURRENT_LIMIT = 10;

function checkUrl(url) {
  if (urlCache.has(url)) return urlCache.get(url);

  const promise = new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve({ url, status: res.statusCode, redirect: res.headers.location });
      } else {
        resolve({ url, status: res.statusCode });
      }
    });
    req.on('error', (err) => resolve({ url, status: 0, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, error: 'timeout' }); });
    req.end();
  });

  urlCache.set(url, promise);
  return promise;
}

async function checkUrlsBatch(urls) {
  const results = [];
  for (let i = 0; i < urls.length; i += CONCURRENT_LIMIT) {
    const batch = urls.slice(i, i + CONCURRENT_LIMIT);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
  }
  return results;
}

// ─── HTML Scanner ────────────────────────────────────────────────────────────

function findHtmlFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractUrls(htmlContent) {
  const urls = new Set();

  for (const pattern of URL_PATTERNS) {
    const matches = htmlContent.match(pattern) || [];
    matches.forEach(u => urls.add(u.replace(/['">\s].*$/, '')));
  }

  const staticMatches = htmlContent.match(STATIC_URL_PATTERN) || [];
  staticMatches.forEach(u => {
    const clean = u.replace(/['">\s].*$/, '').replace(/["']$/, '');
    if (clean.match(/\.(mp3|pdf|css|woff2?|jpg|png|webp)/)) {
      urls.add(clean);
    }
  });

  return [...urls];
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 QA Media Checker - Scanning dist/ for media URLs...\n');

  const packagesToCheck = packageFilter ? [packageFilter] : PACKAGES;
  const allResults = [];
  const summary = { total: 0, ok: 0, broken: 0, redirect: 0, byPackage: {} };

  for (const pkg of packagesToCheck) {
    const distDir = path.join(PACKAGES_DIR, pkg, 'dist');
    if (!fs.existsSync(distDir)) {
      console.log(`⏭️  ${pkg}: No dist/ directory (skipping)\n`);
      continue;
    }

    console.log(`📦 ${pkg}`);
    const htmlFiles = findHtmlFiles(distDir);
    console.log(`   ${htmlFiles.length} HTML files found`);

    // Collect all URLs from all HTML files
    const urlsWithSources = new Map(); // url -> [source files]
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const urls = extractUrls(content);
      for (const url of urls) {
        if (!urlsWithSources.has(url)) urlsWithSources.set(url, []);
        const relPath = path.relative(distDir, file);
        if (!urlsWithSources.get(url).includes(relPath)) {
          urlsWithSources.get(url).push(relPath);
        }
      }
    }

    const uniqueUrls = [...urlsWithSources.keys()];
    console.log(`   ${uniqueUrls.length} unique media URLs to check`);

    // Check all URLs
    const results = await checkUrlsBatch(uniqueUrls);

    const pkgSummary = { ok: 0, broken: [], redirect: [] };

    for (const result of results) {
      summary.total++;
      if (result.status === 200) {
        pkgSummary.ok++;
        summary.ok++;
      } else if (result.status >= 300 && result.status < 400) {
        pkgSummary.redirect.push(result);
        summary.redirect++;
      } else {
        pkgSummary.broken.push({
          ...result,
          sources: urlsWithSources.get(result.url),
        });
        summary.broken++;
      }
    }

    // Print results
    if (pkgSummary.broken.length > 0) {
      console.log(`   ❌ ${pkgSummary.broken.length} BROKEN URLs:`);
      for (const b of pkgSummary.broken) {
        const ext = path.extname(b.url).replace('.', '').toUpperCase();
        console.log(`      [${ext}] ${b.status || 'ERR'} ${b.url}`);
        if (b.error) console.log(`           Error: ${b.error}`);
        console.log(`           Referenced in: ${b.sources.slice(0, 3).join(', ')}${b.sources.length > 3 ? ` (+${b.sources.length - 3} more)` : ''}`);
      }
    }
    if (pkgSummary.redirect.length > 0) {
      console.log(`   ⚠️  ${pkgSummary.redirect.length} redirects:`);
      for (const r of pkgSummary.redirect) {
        console.log(`      ${r.status} ${r.url} → ${r.redirect}`);
      }
    }
    console.log(`   ✅ ${pkgSummary.ok} OK`);
    console.log('');

    summary.byPackage[pkg] = pkgSummary;
    allResults.push(...pkgSummary.broken.map(b => ({ package: pkg, ...b })));
  }

  // Final summary
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📊 SUMMARY: ${summary.total} URLs checked`);
  console.log(`   ✅ ${summary.ok} OK`);
  console.log(`   ❌ ${summary.broken} broken`);
  console.log(`   ⚠️  ${summary.redirect} redirects`);
  console.log('═══════════════════════════════════════════════════════════');

  // Generate fix report
  if (generateFixReport && allResults.length > 0) {
    const reportPath = path.join(PROJECT_ROOT, 'qa-fix-report.json');
    const report = {
      generated: new Date().toISOString(),
      summary: {
        totalBroken: allResults.length,
        byType: {},
        byPackage: {},
      },
      broken: allResults.map(r => ({
        package: r.package,
        url: r.url,
        status: r.status,
        error: r.error || null,
        type: path.extname(r.url).replace('.', ''),
        sources: r.sources,
      })),
    };

    // Group by type
    for (const r of report.broken) {
      report.summary.byType[r.type] = (report.summary.byType[r.type] || 0) + 1;
      report.summary.byPackage[r.package] = (report.summary.byPackage[r.package] || 0) + 1;
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📝 Fix report saved to: qa-fix-report.json`);
  }

  // Exit with error code if broken URLs found
  if (summary.broken > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(2);
});
