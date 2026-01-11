const https = require('https');
const http = require('http');
const { URL } = require('url');

const visited = new Set();
const errors = [];
const baseUrl = 'https://eluno.org';

function fetch(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

function extractLinks(html, baseUrl) {
  const links = new Set();
  const linkRegex = /href=["']([^"']+)["']/g;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let link = match[1];

    // Skip anchors, mailto, tel, javascript
    if (link.startsWith('#') || link.startsWith('mailto:') ||
        link.startsWith('tel:') || link.startsWith('javascript:')) {
      continue;
    }

    // Handle relative URLs
    if (link.startsWith('/')) {
      link = baseUrl + link;
    } else if (!link.startsWith('http')) {
      continue; // Skip relative paths without /
    }

    // Only check internal links
    if (link.startsWith(baseUrl)) {
      links.add(link);
    }
  }

  return Array.from(links);
}

async function checkUrl(url, depth = 0) {
  if (visited.has(url) || depth > 3) return;
  visited.add(url);

  console.log(`Checking [${visited.size}]: ${url}`);

  try {
    const { status, data, headers } = await fetch(url);

    if (status === 404) {
      errors.push({ url, status, error: '404 Not Found' });
      console.log(`❌ 404: ${url}`);
    } else if (status >= 400) {
      errors.push({ url, status, error: `HTTP ${status}` });
      console.log(`⚠️  ${status}: ${url}`);
    } else if (status === 200 && headers['content-type']?.includes('text/html')) {
      console.log(`✅ ${status}: ${url}`);

      // Extract and check links from this page
      const links = extractLinks(data, baseUrl);
      for (const link of links) {
        await checkUrl(link, depth + 1);
      }
    }
  } catch (error) {
    errors.push({ url, status: 'ERROR', error: error.message });
    console.log(`❌ ERROR: ${url} - ${error.message}`);
  }
}

async function main() {
  console.log(`🔍 Checking links on ${baseUrl}...\n`);

  await checkUrl(baseUrl);

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Total URLs checked: ${visited.size}`);
  console.log(`❌ Errors found: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n🚨 ERRORS:\n');
    errors.forEach(({ url, status, error }) => {
      console.log(`[${status}] ${url}`);
      console.log(`   → ${error}\n`);
    });
  } else {
    console.log('\n🎉 No broken links found!');
  }
}

main().catch(console.error);
