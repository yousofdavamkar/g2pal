/* GO2PAL Full-Page Snap Scroll Controller
 * Lightweight navbar visibility control for snap sections
 * Actual snapping is handled by CSS scroll-snap for better performance
 */

class FullPageSnapController {
  constructor(opts = {}) {
    this.cfg = {
      sectionSelector: '.snap-section',
      mobileBreakpoint: 768,
      ...opts
    };

    this.sections = [];
    this.currentSection = 0;
    this.isMobile = window.innerWidth < this.cfg.mobileBreakpoint;
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  init() {
    // Check if we're on index page
    const path = window.location.pathname;
    const isIndexPage = path === '/' || path === '/index.html' || path.endsWith('/');

    if (!isIndexPage) return;

    // Get all snap sections
    this.sections = Array.from(document.querySelectorAll(this.cfg.sectionSelector));

    if (this.sections.length === 0) return;

    // Setup sections
    this.setupSections();

    // Add scroll listener for navbar visibility
    if (!this.isMobile) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });
      this.onScroll();
    }
  }

  setupSections() {
    // Add CSS class to each section for styling
    this.sections.forEach((section, index) => {
      section.classList.add('snap-section-active');
      section.setAttribute('data-snap-index', index);
    });
  }

  onScroll() {
    if (this.isMobile) return;

    // Use requestAnimationFrame for performance
    if (this.ticking) return;
    this.ticking = true;

    requestAnimationFrame(() => {
      this.updateCurrentSection();
      this.ticking = false;
    });
  }

  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < this.cfg.mobileBreakpoint;

    // Switch to/from mobile mode
    if (wasMobile !== this.isMobile) {
      if (this.isMobile) {
        this.enableNormalScroll();
      } else {
        this.init();
      }
    }
  }

  updateCurrentSection() {
    // Find which section is currently in view
    const scrollPos = window.scrollY + window.innerHeight / 2;

    this.sections.forEach((section, index) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        this.currentSection = index;
        section.classList.add('snap-section-current');
      } else {
        section.classList.remove('snap-section-current');
      }
    });

    // Show/hide navbar based on section
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
      if (this.currentSection > 0) {
        navContainer.classList.add('navbar-visible');
        navContainer.classList.remove('navbar-hidden');
      } else {
        navContainer.classList.remove('navbar-visible');
        navContainer.classList.add('navbar-hidden');
      }
    }
  }

  enableNormalScroll() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);

    // Show navbar
    const navContainer = document.getElementById('navbar-container');
    if (navContainer) {
      navContainer.classList.add('navbar-visible');
      navContainer.classList.remove('navbar-hidden');
    }
  }

  destroy() {
    this.enableNormalScroll();
  }
}

// Initialize on DOM ready
let snapController;

function initSnapScroll() {
  // Wait a bit for other components to initialize
  setTimeout(() => {
    snapController = new FullPageSnapController({
      sectionSelector: '.snap-section',
      mobileBreakpoint: 768
    });

    snapController.init();
  }, 100);
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSnapScroll);
} else {
  initSnapScroll();
}

// Export for potential external use
export { FullPageSnapController, initSnapScroll };
