import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import { sri } from 'vite-plugin-sri3'
import crypto from 'crypto'

// ============================================================================
// THEME SCRIPT (Inline)
// ============================================================================
const themeScriptContent = `
<script>
  (function() {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage))
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  })();
</script>
`;

// Calculate SHA-256 hash for CSP (for the theme script)
const scriptBody = themeScriptContent.replace(/<script>|<\/script>/g, '').trim();
const themeScriptHash = crypto.createHash('sha256').update(scriptBody).digest('base64');

// ============================================================================
// CONTENT SECURITY POLICY (CMS-Compatible)
// ============================================================================
// This CSP is relaxed to allow the CMS visual editor (iframe) to:
// - Inject inline scripts for editing functionality
// - Apply inline styles for live preview
// - Allow eval() for some editor operations
//
// SECURITY NOTE: This is less strict than a production-only site.
// If you don't need CMS editing, use stricter CSP values.
// ============================================================================
const csp = [
  "default-src 'self'",
  // Allow: self, inline scripts, eval (for CMS editor), and theme script hash
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'sha256-${themeScriptHash}'`,
  // Allow: self and inline styles (required for CMS live preview)
  "style-src 'self' 'unsafe-inline'",
  // Allow images from self, data URIs, and blob (for CMS uploads preview)
  "img-src 'self' data: blob:",
  // Allow media from self and blob
  "media-src 'self' blob:",
  // Allow fonts from self
  "font-src 'self'",
  // Allow connections to self (API calls)
  "connect-src 'self'",
  // Disallow plugins
  "object-src 'none'",
  // Restrict base URI
  "base-uri 'self'",
  // Allow form submissions to self
  "form-action 'self'",
  // Allow framing from same origin (for CMS editor iframe)
  "frame-src 'self'",
  // Allow being framed by same origin (CMS can embed pages)
  // Note: frame-ancestors in meta tag is ignored by browsers, use HTTP header instead
  // "frame-ancestors 'self'",
  // Upgrade HTTP to HTTPS
  "upgrade-insecure-requests"
  // REMOVED: require-trusted-types-for 'script' - conflicts with CMS editor
].join('; ');

// ============================================================================
// HTML PAGES CONFIGURATION
// ============================================================================
// Helper to create page config (reduces repetition)
const createPageConfig = (filename: string) => ({
  entry: 'src/main.js',
  filename,
  template: filename,
  injectOptions: {
    data: {
      themeScript: themeScriptContent,
    },
    tags: [
      {
        injectTo: 'head-prepend' as const,
        tag: 'meta',
        attrs: {
          'http-equiv': 'Content-Security-Policy',
          content: csp,
        },
      },
    ],
  },
});

// All HTML pages in the project
const htmlPages = [
  'index.html',
  'services.html',
  'about.html',
  'colleagues.html',
  'contact.html',
  'faq.html',
  'application.html',
  'rules.html',
  'policy.html',
];

// ============================================================================
// VITE CONFIGURATION
// ============================================================================
export default defineConfig({
  // Path alias: @ -> ./src
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  // ========================================
  // BUILD OPTIONS
  // ========================================
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for debugging (optional, set to false for production)
    sourcemap: false,
    
    // Rollup-specific options
    rollupOptions: {
      // Ensure all HTML pages are processed
      input: htmlPages.reduce((acc, page) => {
        acc[page.replace('.html', '')] = resolve(__dirname, page);
        return acc;
      }, {} as Record<string, string>),
      
      output: {
        // =============================================
        // STATIC ASSET NAMES (NO HASH)
        // =============================================
        // This ensures filenames are predictable so the CMS
        // can edit HTML files without breaking asset references.
        //
        // Format: assets/[name].[ext] (no hash)
        // =============================================
        
        // Entry JS files (e.g., main.js -> assets/main.js)
        entryFileNames: 'assets/[name].js',
        
        // Code-split chunks (e.g., vendor.js -> assets/vendor.js)
        chunkFileNames: 'assets/[name].js',
        
        // Static assets: CSS, images, fonts, etc.
        // (e.g., style.css -> assets/style.css)
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },

  // ========================================
  // PLUGINS
  // ========================================
  plugins: [
    // Tailwind CSS support
    tailwindcss(),
    
    // Brotli compression (.br files)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024, // Only compress files > 1KB
    }),
    
    // Gzip compression (.gz files)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
    }),
    
    // HTML processing with CSP injection
    createHtmlPlugin({
      minify: true,
      pages: htmlPages.map(createPageConfig),
    }),
    
    // Subresource Integrity (SRI) for external resources
    // Note: With static filenames, SRI helps ensure integrity
    sri({
      // algorithms: ['sha384'],
    }),
    
    // Custom plugin: Cache control headers for preview server
    {
      name: 'configure-preview-server',
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          // Static assets get long cache (1 year)
          // Note: Without hashes, be careful with caching in production!
          // Consider using versioned query strings or ETags
          if (req.url?.includes('/assets/')) {
            // Shorter cache since filenames don't change
            res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate')
          } else {
            // HTML files: no cache
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
          }
          next()
        })
      },
    },
    
    // Custom plugin: Development server CORS for CMS
    {
      name: 'cms-dev-cors',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Allow CMS admin panel to access dev server via iframe
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          next();
        });
      },
    },
    
    // Custom plugin: Clean URLs support for dev server
    // Redirects /contact to /contact.html, etc.
    {
      name: 'clean-urls-dev',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          // Skip if already has extension or is a special path
          if (url.includes('.') || url.startsWith('/@') || url.startsWith('/node_modules')) {
            return next();
          }
          // Skip root
          if (url === '/') {
            return next();
          }
          // Check if there's an HTML file for this path
          const cleanPath = url.split('?')[0]; // Remove query string
          const htmlPath = `${cleanPath}.html`;
          // Rewrite URL internally to .html version
          req.url = htmlPath + (url.includes('?') ? url.substring(url.indexOf('?')) : '');
          next();
        });
      },
    },
  ],

  // ========================================
  // DEV SERVER OPTIONS
  // ========================================
  server: {
    host: '127.0.0.1',
    port: 5173,
    // Allow CMS to embed pages in iframe during development
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
    },
  },

  // ========================================
  // PREVIEW SERVER OPTIONS
  // ========================================
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
});
