/**
 * Device Detection Utilities
 * Helper functions to detect device capabilities and properties
 */

/** Breakpoint constants */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Check if current viewport is mobile size (< 768px)
 * @returns {boolean}
 */
export function isMobile() {
  return window.innerWidth < BREAKPOINTS.md;
}

/**
 * Check if current viewport is tablet size (768px - 1024px)
 * @returns {boolean}
 */
export function isTablet() {
  const width = window.innerWidth;
  return width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
}

/**
 * Check if current viewport is desktop size (>= 1024px)
 * @returns {boolean}
 */
export function isDesktop() {
  return window.innerWidth >= BREAKPOINTS.lg;
}

/**
 * Check if device supports touch
 * @returns {boolean}
 */
export function isTouch() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if page is in RTL mode
 * @returns {boolean}
 */
export function isRTL() {
  return document.documentElement.dir === 'rtl';
}

/**
 * Get current breakpoint name
 * @returns {string}
 */
export function getBreakpoint() {
  const width = window.innerWidth;
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 * @returns {boolean}
 */
export function prefersDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get device pixel ratio (for retina displays)
 * @returns {number}
 */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/**
 * Check if device is retina display
 * @returns {boolean}
 */
export function isRetina() {
  return getPixelRatio() > 1;
}

/**
 * Get user agent string (with basic parsing)
 * @returns {Object}
 */
export function getUserAgent() {
  const ua = navigator.userAgent;
  return {
    raw: ua,
    isIOS: /iPad|iPhone|iPod/.test(ua) && !(window.MSStream),
    isAndroid: /Android/.test(ua),
    isWindows: /Windows/.test(ua),
    isMac: /Macintosh|Mac OS X/.test(ua),
    isLinux: /Linux/.test(ua) && !/Android/.test(ua),
    isChrome: /Chrome/.test(ua) && !/Edge|OPR\//.test(ua),
    isFirefox: /Firefox/.test(ua),
    isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
    isEdge: /Edge/.test(ua),
  };
}

/**
 * Debounce function for resize handlers
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll handlers
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
