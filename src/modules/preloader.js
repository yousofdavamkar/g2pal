/**
 * Preloader Module
 * Handles smart preloader logic with mobile detection and timeouts
 */

import { isMobile } from '../utils/device-detection.js';

const HARD_TIMEOUT = 3000; // 3 second hard timeout for desktop

/**
 * Initialize preloader
 */
export function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  // Mobile: Disable preloader completely, show content immediately
  if (isMobile()) {
    hidePreloader();
    return;
  }

  // Desktop: Keep preloader with 3 second hard timeout
  let preloaderHidden = false;

  /**
   * Safely hide the preloader (prevents double-hiding)
   */
  const safeHidePreloader = () => {
    if (preloaderHidden) return;
    preloaderHidden = true;
    hidePreloader();
  };

  // Hard timeout - removes preloader after 3s no matter what
  const timeoutId = setTimeout(safeHidePreloader, HARD_TIMEOUT);

  // Also hide on window load (if it fires before timeout)
  window.addEventListener("load", () => {
    clearTimeout(timeoutId);
    safeHidePreloader();
  });
}

/**
 * Hide the preloader element
 */
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hidden");
  }
  document.body.classList.remove("loading");
}
