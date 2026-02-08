/**
 * Sticky Scroll Snap System v5.1
 * 
 * BEHAVIOR:
 * - DOWN: Hero → Articles (snap) → Services (free scroll)
 * - UP: Free scroll → When reaching sticky wrapper → snap back through articles to Hero
 */

(function () {
  let sections = [];
  let stickyWrapper = null;
  let currentIndex = 0;
  let isScrolling = false;
  const SCROLL_DURATION = 300; // Reduced for less lag
  const SCROLL_COOLDOWN = 50; // Reduced for quicker response
  let lastWheelTime = 0;

  function init() {
    // Desktop only (1024px+) - disable on mobile/tablet
    if (window.innerWidth < 1024) return;

    stickyWrapper = document.querySelector('.sticky-wrapper');
    sections = Array.from(document.querySelectorAll('.sticky-section'));

    if (!stickyWrapper || sections.length === 0) return;

    // Preload images
    sections.forEach(section => {
      section.querySelectorAll('img').forEach(img => {
        img.loading = 'eager';
      });
    });

    document.addEventListener('wheel', handleWheel, { passive: false });

    console.log('Scroll snap v5.1 - sections:', sections.length);
  }

  function getWrapperTop() {
    return stickyWrapper.offsetTop;
  }

  function getWrapperScrollHeight() {
    // Total scroll distance through all sticky sections
    return sections.length * window.innerHeight;
  }

  function getWrapperBottom() {
    return getWrapperTop() + getWrapperScrollHeight();
  }

  function getSectionScrollY(index) {
    return getWrapperTop() + (index * window.innerHeight);
  }

  function getCurrentSectionIndex() {
    const scrollY = window.scrollY;
    const wrapperTop = getWrapperTop();
    const vh = window.innerHeight;
    const relativeScroll = scrollY - wrapperTop;
    const index = Math.round(relativeScroll / vh);
    return Math.max(0, Math.min(index, sections.length - 1));
  }

  function handleWheel(e) {
    if (isScrolling) {
      e.preventDefault();
      return;
    }

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const wrapperTop = getWrapperTop();
    const wrapperBottom = getWrapperBottom();
    const isDown = e.deltaY > 0;
    const direction = isDown ? 1 : -1;

    // Calculate boundaries
    const lastSectionTop = getSectionScrollY(sections.length - 1);

    // ZONE A: Above the wrapper (free scroll)
    if (scrollY < wrapperTop - 10) {
      // Going down and about to hit wrapper
      if (isDown && scrollY + 50 >= wrapperTop) {
        e.preventDefault();
        currentIndex = 0;
        scrollToY(wrapperTop);
        return;
      }
      return; // Free scroll
    }

    // ZONE B: Inside the wrapper (snap scroll)
    // This is when scrollY is between wrapperTop and lastSectionTop + vh
    if (scrollY >= wrapperTop - 10 && scrollY < lastSectionTop + vh - 10) {
      e.preventDefault();

      // Cooldown
      const now = Date.now();
      if (now - lastWheelTime < SCROLL_COOLDOWN) return;
      lastWheelTime = now;

      currentIndex = getCurrentSectionIndex();
      const targetIndex = currentIndex + direction;

      console.log('SNAP:', currentIndex, '→', targetIndex, isDown ? '↓' : '↑');

      // Exit up
      if (targetIndex < 0) {
        scrollToY(wrapperTop - 50);
        return;
      }

      // Exit down (to services)
      if (targetIndex >= sections.length) {
        scrollToY(wrapperBottom + 10);
        return;
      }

      // Snap to section
      currentIndex = targetIndex;
      scrollToY(getSectionScrollY(targetIndex));
      return;
    }

    // ZONE C: Below the wrapper (services and beyond)
    // This is when scrollY >= lastSectionTop + vh
    if (scrollY >= lastSectionTop + vh - 10) {
      // Going up - check if we should re-enter snap zone
      if (!isDown) {
        // If we're close to the wrapper bottom, snap to last section
        if (scrollY <= wrapperBottom + 100) {
          e.preventDefault();
          currentIndex = sections.length - 1;
          scrollToY(lastSectionTop);
          return;
        }
      }
      // Free scroll in this zone
      return;
    }
  }

  function scrollToY(targetY) {
    isScrolling = true;

    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isScrolling = false;
      }
    }

    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

export { };
