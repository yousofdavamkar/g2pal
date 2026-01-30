/* GO2PAL Hero Scroll Controller v2.2 - Only Navbar Visibility Control */

// Preloader
(function() {
  let loaded = false;
  const hide = () => {
    if (loaded) return;
    loaded = true;
    const p = document.getElementById('preloader');
    if (p) p.classList.add('hidden');
    setTimeout(() => document.body?.classList.remove('loading'), 100);
  };
  window.addEventListener('load', hide);
  setTimeout(hide, 6000);
})();

class HeroScrollController {
  constructor(opts = {}) {
    this.cfg = { 
      selector: '.hero-scroll-section', 
      mobileBreakpoint: 768, // Mobile < 768px, Tablet/Desktop >= 768px
      scrollThreshold: 100, // Pixels to scroll before showing navbar
      ...opts 
    };
    this.section = null;
    this.isIndexPage = false;
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }
  
  init() {
    // On mobile, ensure navbar is visible
    if (window.innerWidth < this.cfg.mobileBreakpoint) {
      document.body?.classList.remove('loading');
      const navContainer = document.getElementById('navbar-container');
      if (navContainer) {
        navContainer.classList.remove('navbar-hidden');
        navContainer.classList.add('navbar-visible');
      }
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.section = document.querySelector(this.cfg.selector);
    if (!this.section) return;

    // Check if this is the index page (has hero section)
    const path = window.location.pathname;
    this.isIndexPage = path === '/' || path === '/index.html' || path.endsWith('/');

    this.isDesktop = window.innerWidth >= this.cfg.mobileBreakpoint;
    this.waitForNavbar();
  }
  
  waitForNavbar() {
    const navContainer = document.getElementById('navbar-container');
    if (navContainer && navContainer.innerHTML.trim()) {
      // Only hide navbar initially on index page + desktop/tablet
      if (this.isIndexPage && this.isDesktop) {
        navContainer.classList.add('navbar-hidden');
      }

      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });
      this.onScroll();
    } else {
      setTimeout(() => this.waitForNavbar(), 100);
    }
  }
  
  onResize() {
    this.isDesktop = window.innerWidth >= this.cfg.mobileBreakpoint;

    if (window.innerWidth < this.cfg.mobileBreakpoint) {
      this.destroy();
      const navContainer = document.getElementById('navbar-container');
      if (navContainer) {
        navContainer.classList.remove('navbar-hidden');
        navContainer.classList.add('navbar-visible');
      }
      return;
    }

    this.onScroll();
  }
  
  onScroll() {
    if (!this.section || window.innerWidth < this.cfg.mobileBreakpoint) return;
    
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Only control navbar visibility on desktop/tablet AND index page
    if (this.isDesktop && this.isIndexPage) {
      const navContainer = document.getElementById('navbar-container');
      if (navContainer) {
        const shouldShowNavbar = scrollY > this.cfg.scrollThreshold;
        navContainer.classList.toggle('navbar-visible', shouldShowNavbar);
        navContainer.classList.toggle('navbar-hidden', !shouldShowNavbar);
      }
    }
  }
  
  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }
}

// Initialize
const ctrl = new HeroScrollController({ scrollThreshold: 100, mobileBreakpoint: 768 });
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ctrl.init());
} else {
  ctrl.init();
}

export { HeroScrollController };
