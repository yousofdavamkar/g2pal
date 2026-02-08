/**
 * Sticky Scroll Snap System v3.1
 * Full viewport snap-scroll for hero and sticky sections
 * Pure vanilla JS - no external libraries
 *
 * Fixes:
 * - Proper handling of all 5 sticky sections (Hero + 4 Articles)
 * - Smooth scroll up and down
 * - No CSS scroll-snap bugs
 */

class StickyScrollController {
  constructor() {
    this.sections = [];
    this.currentIndex = 0;
    this.isScrolling = false;
    this.touchStartY = 0;
    this.lastScrollTime = 0;
    this.scrollCooldown = 600; // ms between snaps
    this.initialized = false;
    this.stickyWrapper = null;
    this.isInStickyArea = false;
  }

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.enableFreeScroll();
      return;
    }

    // Mobile check - disable on mobile
    if (window.innerWidth < 768) {
      this.enableFreeScroll();
      return;
    }

    // Get sticky wrapper
    this.stickyWrapper = document.querySelector('.sticky-wrapper');
    if (!this.stickyWrapper) {
      console.log('No sticky wrapper found');
      return;
    }

    // Get all sticky sections
    this.sections = Array.from(document.querySelectorAll('.sticky-section'));

    if (this.sections.length === 0) {
      console.log('No sticky sections found');
      return;
    }

    console.log(`StickyScrollController: Found ${this.sections.length} sticky sections`);

    // Disable CSS scroll-snap entirely - we'll handle it with JS
    this.disableCSSScrollSnap();

    // Setup event listeners
    this.setupEventListeners();

    // Preload all images in sections
    this.preloadImages();

    // Determine initial section based on scroll position
    this.updateCurrentIndexFromScroll();

    this.initialized = true;
  }

  disableCSSScrollSnap() {
    // Remove all CSS scroll-snap properties
    document.documentElement.classList.remove('snap-active');
    document.documentElement.style.scrollSnapType = 'none';
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollSnapType = 'none';

    // Remove scroll-snap from sections
    this.sections.forEach(section => {
      section.style.scrollSnapAlign = 'none';
      section.style.scrollSnapStop = 'auto';
    });
  }

  enableFreeScroll() {
    document.documentElement.style.scrollSnapType = 'none';
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  preloadImages() {
    // Find all images in sticky sections and preload them
    this.sections.forEach(section => {
      const images = section.querySelectorAll('img');
      images.forEach(img => {
        if (img.loading === 'lazy') {
          img.loading = 'eager';
        }
        // Trigger load if src exists
        if (img.src && !img.complete) {
          const preloadImg = new Image();
          preloadImg.src = img.src;
        }
      });
    });
  }

  setupEventListeners() {
    // Wheel event for mouse scroll
    this.boundHandleWheel = this.handleWheel.bind(this);
    window.addEventListener('wheel', this.boundHandleWheel, { passive: false });

    // Touch events for mobile/trackpad
    this.boundHandleTouchStart = this.handleTouchStart.bind(this);
    this.boundHandleTouchEnd = this.handleTouchEnd.bind(this);
    window.addEventListener('touchstart', this.boundHandleTouchStart, { passive: true });
    window.addEventListener('touchend', this.boundHandleTouchEnd, { passive: false });

    // Keyboard navigation
    this.boundHandleKeydown = this.handleKeydown.bind(this);
    window.addEventListener('keydown', this.boundHandleKeydown, { passive: false });

    // Resize handler
    this.boundHandleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.boundHandleResize, { passive: true });

    // Track scroll position
    this.boundHandleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
  }

  handleScroll() {
    if (!this.stickyWrapper) return;

    const scrollY = window.scrollY;
    const wrapperTop = this.stickyWrapper.offsetTop;
    const wrapperHeight = this.stickyWrapper.offsetHeight;
    const wrapperBottom = wrapperTop + wrapperHeight;
    const viewportHeight = window.innerHeight;

    // Check if in sticky area (with some tolerance)
    this.isInStickyArea = scrollY >= wrapperTop - 50 && scrollY < wrapperBottom - viewportHeight + 50;

    // Update current index from scroll position
    if (!this.isScrolling) {
      this.updateCurrentIndexFromScroll();
    }
  }

  updateCurrentIndexFromScroll() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Find which section is most visible
    let bestIndex = 0;
    let bestVisibility = -Infinity;

    this.sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;

      // Calculate visibility score (closer to 0 = more visible)
      const visibility = -Math.abs(sectionTop);

      if (visibility > bestVisibility) {
        bestVisibility = visibility;
        bestIndex = index;
      }
    });

    this.currentIndex = bestIndex;
  }

  isWithinStickyArea() {
    if (!this.stickyWrapper) return false;

    const scrollY = window.scrollY;
    const wrapperTop = this.stickyWrapper.offsetTop;
    const wrapperHeight = this.stickyWrapper.offsetHeight;
    const wrapperBottom = wrapperTop + wrapperHeight;
    const viewportHeight = window.innerHeight;

    return scrollY >= wrapperTop - 100 && scrollY < wrapperBottom - viewportHeight + 100;
  }

  handleWheel(e) {
    if (!this.initialized || !this.stickyWrapper) return;

    // Check if we're in the sticky wrapper area
    if (!this.isWithinStickyArea()) {
      return; // Free scroll outside sticky area
    }

    // Prevent too rapid scrolling
    const now = Date.now();
    if (now - this.lastScrollTime < this.scrollCooldown || this.isScrolling) {
      e.preventDefault();
      return;
    }

    const direction = e.deltaY > 0 ? 1 : -1;
    const targetIndex = this.currentIndex + direction;

    // Check boundaries
    if (targetIndex < 0) {
      // At first section, trying to scroll up - allow free scroll above
      return;
    }

    if (targetIndex >= this.sections.length) {
      // At last section, trying to scroll down - exit sticky area
      e.preventDefault();
      this.lastScrollTime = now;
      this.exitStickyArea();
      return;
    }

    // Valid snap target - prevent default and snap
    e.preventDefault();
    this.lastScrollTime = now;
    this.scrollToSection(targetIndex, true);
  }

  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchEnd(e) {
    if (!this.initialized || !this.isWithinStickyArea()) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = this.touchStartY - touchEndY;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      const direction = diff > 0 ? 1 : -1;
      const targetIndex = this.currentIndex + direction;

      if (targetIndex >= 0 && targetIndex < this.sections.length) {
        e.preventDefault();
        this.scrollToSection(targetIndex, true);
      } else if (targetIndex >= this.sections.length) {
        e.preventDefault();
        this.exitStickyArea();
      }
    }
  }

  handleKeydown(e) {
    if (!this.initialized || !this.isWithinStickyArea()) return;

    // Only handle arrow keys and space/page keys
    const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'];
    if (!keys.includes(e.code)) return;

    e.preventDefault();

    let direction = 0;
    if (['ArrowDown', 'PageDown', 'Space'].includes(e.code)) {
      direction = 1;
    } else if (['ArrowUp', 'PageUp'].includes(e.code)) {
      direction = -1;
    }

    const targetIndex = this.currentIndex + direction;

    if (targetIndex >= 0 && targetIndex < this.sections.length) {
      this.scrollToSection(targetIndex, true);
    } else if (targetIndex >= this.sections.length) {
      this.exitStickyArea();
    }
  }

  handleResize() {
    // Disable on mobile
    if (window.innerWidth < 768) {
      this.enableFreeScroll();
      this.initialized = false;
    } else if (!this.initialized) {
      this.init();
    }
  }

  scrollToSection(index, animate = true) {
    if (index < 0 || index >= this.sections.length) return;
    if (this.isScrolling) return;

    this.isScrolling = true;
    this.currentIndex = index;

    const section = this.sections[index];
    const targetY = section.offsetTop;

    console.log(`Scrolling to section ${index}, targetY: ${targetY}`);

    if (animate) {
      // Smooth scroll animation
      this.smoothScrollTo(targetY, () => {
        this.isScrolling = false;
      });
    } else {
      window.scrollTo(0, targetY);
      this.isScrolling = false;
    }
  }

  smoothScrollTo(targetY, callback) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 600; // ms
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    };

    requestAnimationFrame(animate);
  }

  exitStickyArea() {
    if (!this.stickyWrapper) return;

    this.isScrolling = true;

    // Scroll to just after the sticky wrapper
    const targetY = this.stickyWrapper.offsetTop + this.stickyWrapper.offsetHeight;

    console.log(`Exiting sticky area, scrolling to: ${targetY}`);

    this.smoothScrollTo(targetY, () => {
      this.isScrolling = false;
    });
  }

  destroy() {
    if (this.boundHandleWheel) {
      window.removeEventListener('wheel', this.boundHandleWheel);
    }
    if (this.boundHandleTouchStart) {
      window.removeEventListener('touchstart', this.boundHandleTouchStart);
    }
    if (this.boundHandleTouchEnd) {
      window.removeEventListener('touchend', this.boundHandleTouchEnd);
    }
    if (this.boundHandleKeydown) {
      window.removeEventListener('keydown', this.boundHandleKeydown);
    }
    if (this.boundHandleResize) {
      window.removeEventListener('resize', this.boundHandleResize);
    }
    if (this.boundHandleScroll) {
      window.removeEventListener('scroll', this.boundHandleScroll);
    }
    this.initialized = false;
  }
}

// Initialize on DOM ready
const stickyScrollController = new StickyScrollController();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => stickyScrollController.init());
} else {
  stickyScrollController.init();
}

export { StickyScrollController };
