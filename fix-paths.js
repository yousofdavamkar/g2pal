#!/usr/bin/env node
/**
 * ============================================================================
 * POST-BUILD PATH FIXER
 * ============================================================================
 * 
 * This script updates all asset paths in built HTML files for the 
 * organized server structure:
 * 
 *   /images/...  →  /public/images/...
 *   /videos/...  →  /public/videos/...
 *   /fonts/...   →  /public/fonts/...
 *   /favicon/... →  /public/favicon/...
 * 
 * Run after `npm run build`:
 *   node fix-paths.js
 * 
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DIST_DIR = './dist';
const HTML_FILES = [
  'index.html',
  'about.html',
  'services.html',
  'contact.html',
  'colleagues.html',
  'faq.html',
  'application.html',
  'rules.html',
  'policy.html',
];

// Path replacements: OLD → NEW
const PATH_REPLACEMENTS = [
  // Images
  { from: /src="\/images\//g, to: 'src="/public/images/' },
  { from: /srcset="\/images\//g, to: 'srcset="/public/images/' },
  { from: /href="\/images\//g, to: 'href="/public/images/' },
  { from: /data-src="\/images\//g, to: 'data-src="/public/images/' },
  { from: /data-srcset="\/images\//g, to: 'data-srcset="/public/images/' },
  { from: /url\(\/images\//g, to: 'url(/public/images/' },
  { from: /url\('\/images\//g, to: "url('/public/images/" },
  { from: /url\("\/images\//g, to: 'url("/public/images/' },
  
  // Videos
  { from: /src="\/videos\//g, to: 'src="/public/videos/' },
  { from: /poster="\/videos\//g, to: 'poster="/public/videos/' },
  
  // Fonts
  { from: /src="\/fonts\//g, to: 'src="/public/fonts/' },
  { from: /url\(\/fonts\//g, to: 'url(/public/fonts/' },
  { from: /url\('\/fonts\//g, to: "url('/public/fonts/" },
  { from: /url\("\/fonts\//g, to: 'url("/public/fonts/' },
  
  // Favicon
  { from: /href="\/favicon\//g, to: 'href="/public/favicon/' },
  { from: /src="\/favicon\//g, to: 'src="/public/favicon/' },
  
  // Manifest
  { from: /href="\/site\.webmanifest"/g, to: 'href="/public/favicon/site.webmanifest"' },
];

// Stats
let filesProcessed = 0;
let totalReplacements = 0;

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('  🔧 POST-BUILD PATH FIXER');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// Process each HTML file
HTML_FILES.forEach(filename => {
  const filepath = path.join(DIST_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`  ⚠️  Skipping ${filename} (not found)`);
    return;
  }
  
  let content = fs.readFileSync(filepath, 'utf8');
  let fileReplacements = 0;
  
  // Apply all replacements
  PATH_REPLACEMENTS.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(from, to);
    }
  });
  
  // Write updated content
  fs.writeFileSync(filepath, content, 'utf8');
  
  filesProcessed++;
  totalReplacements += fileReplacements;
  
  console.log(`  ✅ ${filename} — ${fileReplacements} paths updated`);
});

console.log('');
console.log('───────────────────────────────────────────────────────────────');
console.log(`  📊 Summary: ${filesProcessed} files, ${totalReplacements} paths fixed`);
console.log('───────────────────────────────────────────────────────────────');
console.log('');
console.log('  Next steps:');
console.log('    1. Upload dist/ folder to server as /dist/');
console.log('    2. Upload public/ folder to server as /public/');
console.log('    3. Copy dist/*.html to server root (public_html/)');
console.log('    4. Upload admin/ folder to server as /admin/');
console.log('');
