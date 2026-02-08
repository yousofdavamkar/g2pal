/**
 * Theme Module
 * Handles dark/light mode toggle with localStorage persistence
 */

import { storage } from '../utils/storage.js';

const THEME_STORAGE_KEY = 'theme';

/**
 * Initialize theme toggle functionality
 */
export function initThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle");

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      toggleTheme();
    });
  }
}

/**
 * Toggle between dark and light mode
 */
export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");

  // Update aria-pressed for accessibility
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute("aria-pressed", isDark);
  }

  // Save preference
  storage.set(THEME_STORAGE_KEY, isDark ? "dark" : "light");

  return isDark;
}

/**
 * Set theme to a specific mode
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Update aria-pressed for accessibility
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute("aria-pressed", theme === "dark");
  }

  // Save preference
  storage.set(THEME_STORAGE_KEY, theme);
}

/**
 * Get current theme preference
 * @returns {string} 'dark' or 'light'
 */
export function getTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Initialize theme from localStorage or system preference
 * Called on page load
 */
export function initTheme() {
  const savedTheme = storage.get(THEME_STORAGE_KEY);

  if (savedTheme) {
    // Use saved preference
    setTheme(savedTheme);
  } else {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  // Listen for system theme changes (only if no saved preference)
  if (!savedTheme) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      setTheme(e.matches ? "dark" : "light");
    });
  }
}
