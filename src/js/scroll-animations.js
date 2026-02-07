/**
 * Custom Scroll Snap Animation System v2.1
 * Full viewport snap-scroll for hero and articles sections
 * Pure vanilla JS - no external libraries
 *
 * Behavior:
 * - Scroll down: Snap through hero → articles → free scroll
 * - Scroll up after passing last article: Free scroll with reverse animations
 */

class ScrollAnimationController {
  constructor(options = {}) {
    this.config = {
      heroSelector: '.hero-scroll-section',
      articlesSelector: 'section.section article',
      articlesSectionSelector: 'section.section',
      mobileBreakpoint: 768,
      snapThreshold: 0.1, // 10% scroll triggers snap
      ...options
    };

    this.heroSection = null;
    this.articlesSection = null;
    this.articles = [];
    this.snapSections = [];
    this.currentSection = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.targetScrollY = 0;
    this.isSnapMode = true;
    this.hasPassedLastSection = false;
    this.lastKnownScrollY = 0;

    // Bind methods
    this.onScroll = this.onScroll.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.smoothScrollTo = this.smoothScrollTo.bind(this);
  }

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Get elements
    this.heroSection = document.querySelector(this.config.heroSelector);
    this.articlesSection = document.querySelector(this.config.articlesSectionSelector);
    this.articles = Array.from(document.querySelectorAll(this.config.articlesSelector));

    if (!this.heroSection || !this.articlesSection || this.articles.length === 0) {
      return;
    }

    // Create snap sections array (hero + articles)
    this.snapSections = [this.heroSection, ...this.articles];

    // Set up sections for full viewport
    this.setupSections();

    // Add scroll snap CSS
    this.addSnapStyles();

    // Start listening for scroll events
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize.bind(this), { passive: true });

    // Initial update
    this.lastKnownScrollY = window.scrollY || window.pageYOffset;
    this.updateCurrentSection();
  }

  setupSections() {
    // Make hero section full viewport
    this.heroSection.style.minHeight = '100vh';
    this.heroSection.style.minHeight = '100dvh';
    this.heroSection.style.height = '100vh';
    this.heroSection.style.height = '100dvh';
    this.heroSection.classList.add('snap-section-start');

    // Make articles section full viewport per article
    this.articlesSection.classList.add('snap-sections-container');

    this.articles.forEach((article, index) => {
      article.style.minHeight = '100vh';
      article.style.minHeight = '100dvh';
      article.style.height = '100vh';
      article.style.height = '100dvh';
      article.style.display = 'flex';
      article.style.alignItems = 'center';
      article.classList.add('snap-section-item');

      // Add initial animation state
      article.style.opacity = '0';
      article.style.transform = 'translateY(60px) scale(0.95)';
      article.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                                  transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`;
    });

    // Add small spacing after last article for transition to normal scroll
    const spacer = document.createElement('div');
    spacer.className = 'snap-scroll-spacer';
    spacer.style.height = '10vh';
    this.articlesSection.appendChild(spacer);
  }

  addSnapStyles() {
    // Add CSS for snap behavior
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: auto !important;
      }

      body.snap-mode {
        overflow-x: hidden;
        overflow-y: auto;
      }

      body.free-scroll {
        scroll-behavior: smooth !important;
      }

      .snap-section-start,
      .snap-section-item {
        position: relative;
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }

      .snap-sections-container {
        scroll-snap-type: y mandatory;
      }

      .snap-scroll-spacer {
        scroll-snap-align: none;
      }

      /* Smooth scroll transition */
      .smooth-scrolling {
        scroll-behavior: smooth !important;
      }
    `;
    document.head.appendChild(style);

    // Add snap mode class to body
    document.body.classList.add('snap-mode');
    this.articlesSection.style.scrollSnapType = 'y mandatory';
  }

  updateCurrentSection() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const scrollDirection = scrollY > this.lastKnownScrollY ? 'down' : 'up';
    this.lastKnownScrollY = scrollY;

    // If we've passed the last section and scrolling up, allow free scroll
    if (this.hasPassedLastSection && scrollDirection === 'up') {
      // Check if we've scrolled back to near the last section
      const lastSection = this.snapSections[this.snapSections.length - 1];
      const lastSectionRect = lastSection.getBoundingClientRect();

      // If we're back at the last section, re-enable snap mode
      if (lastSectionRect.top >= -windowHeight * 0.5) {
        this.isSnapMode = true;
        this.hasPassedLastSection = false;
        document.body.classList.add('snap-mode');
        this.articlesSection.style.scrollSnapType = 'y mandatory';
        window.addEventListener('wheel', this.onWheel, { passive: false });
      }

      // Animate sections based on visibility
      this.animateSectionsOnScroll();
      return;
    }

    // Find which section we're currently viewing
    let newSection = 0;
    for (let i = 0; i < this.snapSections.length; i++) {
      const section = this.snapSections[i];
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;

      // If we're past the middle of this section
      if (scrollY >= sectionTop - windowHeight / 2) {
        newSection = i;
      }
    }

    if (newSection !== this.currentSection) {
      this.currentSection = newSection;
      this.animateSection(newSection);

      // Check if we've passed all snap sections (with threshold)
      if (newSection >= this.snapSections.length - 1) {
        // Mark that we've passed, but don't exit snap mode yet
        // Let one more scroll action trigger exit
        if (!this.scrollTimeout) {
          this.scrollTimeout = setTimeout(() => {
            this.hasPassedLastSection = true;
            this.exitSnapMode();
            this.scrollTimeout = null;
          }, 300);
        }
      } else {
        // Clear timeout if we're not at the last section
        if (this.scrollTimeout) {
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = null;
        }
        this.hasPassedLastSection = false;
      }
    }
  }

  animateSection(index) {
    // Animate the current section
    const section = this.snapSections[index];

    if (section.classList.contains('snap-section-item')) {
      // It's an article - animate it in
      section.style.opacity = '1';
      section.style.transform = 'translateY(0) scale(1)';
    }

    // Animate hero content
    if (index === 0) {
      this.animateHeroSection(0);
    }
  }

  animateSectionsOnScroll() {
    // Animate sections based on scroll position (for free scroll mode)
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;

    this.articles.forEach((article, index) => {
      const rect = article.getBoundingClientRect();
      const visibility = 1 - (rect.top / windowHeight);

      if (visibility > 0.1 && visibility < 1.5) {
        article.style.opacity = Math.min(1, Math.max(0, visibility));
        const translateY = Math.max(0, (1 - visibility) * 60);
        const scale = 0.95 + (visibility * 0.05);
        article.style.transform = `translateY(${translateY}px) scale(${Math.min(1, scale)})`;
      }
    });

    // Also animate hero if visible
    const heroRect = this.heroSection.getBoundingClientRect();
    if (heroRect.bottom > 0) {
      const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / windowHeight));
      this.animateHeroSection(scrollProgress);
    }
  }

  animateHeroSection(scrollProgress) {
    const heroContent = this.heroSection.querySelector('.hero-content');
    const heroText = this.heroSection.querySelector('.hero-text');
    const heroSubject = this.heroSection.querySelector('.hero-subject');
    const heroSubjectImg = this.heroSection.querySelector('.hero-subject-img');
    const heroSubjectBg = this.heroSection.querySelector('.hero-subject-bg');

    if (heroContent) {
      const fadeProgress = Math.min(1, scrollProgress * 2);
      const scaleProgress = 1 - (fadeProgress * 0.1);
      const translateY = scrollProgress * -30;

      heroContent.style.transform = `translateY(${translateY}px) scale(${scaleProgress})`;
      heroContent.style.opacity = 1 - (fadeProgress * 0.3);
    }

    if (heroText) {
      const textY = scrollProgress * -20;
      heroText.style.transform = `translateY(${textY}px)`;
    }

    if (heroSubject) {
      const imageY = scrollProgress * -40;
      heroSubject.style.transform = `translateY(${imageY}px)`;
    }

    if (heroSubjectImg) {
      const imageScale = 1 + (scrollProgress * 0.15);
      const imageRotate = scrollProgress * 3;
      heroSubjectImg.style.transform = `scale(${imageScale}) rotate(${imageRotate}deg)`;
    }

    if (heroSubjectBg) {
      const bgOpacity = 0.85 - (scrollProgress * 0.5);
      const bgScale = 1 + (scrollProgress * 0.3);
      heroSubjectBg.style.opacity = Math.max(0, bgOpacity);
      heroSubjectBg.style.transform = `translate(-50%, -50%) scale(${bgScale})`;
    }
  }

  onWheel(event) {
    if (!this.isSnapMode) {
      return; // Allow normal scrolling
    }

    // Prevent default for smoother control
    event.preventDefault();

    // Clear any pending scroll
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Determine scroll direction
    const delta = event.deltaY;
    const direction = delta > 0 ? 1 : -1;

    // Calculate target section
    let targetSection = this.currentSection + direction;

    // Clamp to valid range
    targetSection = Math.max(0, Math.min(targetSection, this.snapSections.length - 1));

    // Don't snap if trying to go past the last section - exit snap mode instead
    if (targetSection >= this.snapSections.length - 1 && direction > 0) {
      this.hasPassedLastSection = true;
      this.exitSnapMode();
      return;
    }

    // Scroll to target section
    this.scrollToSection(targetSection);
  }

  scrollToSection(index) {
    if (index < 0 || index >= this.snapSections.length) {
      return;
    }

    const section = this.snapSections[index];
    const rect = section.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const targetY = rect.top + scrollY;

    this.smoothScrollTo(targetY, () => {
      this.currentSection = index;
      this.animateSection(index);
    });
  }

  smoothScrollTo(targetY, callback) {
    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    const duration = 800;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        if (callback) {
          callback();
        }
      }
    };

    requestAnimationFrame(animateScroll);
  }

  onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollDirection = scrollY > this.lastKnownScrollY ? 'down' : 'up';

    if (this.isSnapMode) {
      this.updateCurrentSection();

      // Animate hero based on scroll position within hero section
      const heroRect = this.heroSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (heroRect.bottom > 0) {
        const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / windowHeight));
        this.animateHeroSection(scrollProgress);
      }
    } else if (this.hasPassedLastSection) {
      // Free scroll mode - animate sections based on visibility
      this.animateSectionsOnScroll();

      // Check if we've scrolled back up enough to re-enable snap mode
      const lastSection = this.snapSections[this.snapSections.length - 1];
      const lastSectionRect = lastSection.getBoundingClientRect();

      if (scrollDirection === 'up' && lastSectionRect.top >= -window.innerHeight * 0.3) {
        // Re-enable snap mode
        this.isSnapMode = true;
        this.hasPassedLastSection = false;
        document.body.classList.add('snap-mode');
        document.body.classList.remove('free-scroll');
        this.articlesSection.style.scrollSnapType = 'y mandatory';
        window.addEventListener('wheel', this.onWheel, { passive: false });
      }
    }
  }

  exitSnapMode() {
    this.isSnapMode = false;
    this.hasPassedLastSection = true;
    document.body.classList.remove('snap-mode');
    document.body.classList.add('free-scroll');

    // Remove scroll snap
    if (this.articlesSection) {
      this.articlesSection.style.scrollSnapType = '';
    }

    // Enable smooth scrolling
    const html = document.documentElement;
    html.style.scrollBehavior = 'smooth';

    // Clean up wheel event listener
    window.removeEventListener('wheel', this.onWheel);
  }

  onResize() {
    // Recalculate on resize
    if (this.isSnapMode) {
      this.updateCurrentSection();
    }
  }

  destroy() {
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);

    // Remove styles
    document.body.classList.remove('snap-mode');
    document.body.classList.remove('free-scroll');

    if (this.articlesSection) {
      this.articlesSection.style.scrollSnapType = '';
    }

    // Remove inline styles
    this.snapSections.forEach(section => {
      section.style.minHeight = '';
      section.style.height = '';
    });

    this.articles.forEach(article => {
      article.style.opacity = '';
      article.style.transform = '';
      article.style.transition = '';
      article.style.display = '';
      article.style.alignItems = '';
    });
  }
}

// Initialize
const scrollAnimCtrl = new ScrollAnimationController();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => scrollAnimCtrl.init());
} else {
  scrollAnimCtrl.init();
}

export { ScrollAnimationController };
