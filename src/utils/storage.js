/**
 * LocalStorage Wrapper with Error Handling
 * Safe storage operations with fallbacks for private browsing mode
 */

/** Storage keys used in the application */
export const STORAGE_KEYS = {
  THEME: 'theme',
  // Add more keys as needed
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export function get(key, defaultValue = null) {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (e) {
    console.warn(`Error reading from localStorage (${key}):`, e);
    return defaultValue;
  }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export function set(key, value) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const item = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, item);
    return true;
  } catch (e) {
    console.warn(`Error writing to localStorage (${key}):`, e);
    return false;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function remove(key) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.warn(`Error removing from localStorage (${key}):`, e);
    return false;
  }
}

/**
 * Clear all items from localStorage
 * @returns {boolean} Success status
 */
export function clear() {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (e) {
    console.warn('Error clearing localStorage:', e);
    return false;
  }
}

/**
 * Get all keys from localStorage
 * @returns {string[]} Array of keys
 */
export function keys() {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    return Object.keys(localStorage);
  } catch (e) {
    console.warn('Error getting localStorage keys:', e);
    return [];
  }
}

/**
 * Check if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export function has(key) {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    return localStorage.getItem(key) !== null;
  } catch (e) {
    return false;
  }
}

/**
 * Get number of items in localStorage
 * @returns {number}
 */
export function size() {
  if (!isStorageAvailable()) {
    return 0;
  }

  try {
    return localStorage.length;
  } catch (e) {
    return 0;
  }
}

/**
 * Session storage wrapper (same API as localStorage but clears on page close)
 */
export const session = {
  get: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch {
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      const item = typeof value === 'string' ? value : JSON.stringify(value);
      sessionStorage.setItem(key, item);
      return true;
    } catch {
      return false;
    }
  },

  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: () => {
    try {
      sessionStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  has: (key) => {
    try {
      return sessionStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },
};

/**
 * Cookie helper for fallback storage
 */
export const cookie = {
  /**
   * Set cookie
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} days - Expiration in days
   */
  set(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  },

  /**
   * Get cookie value
   * @param {string} name - Cookie name
   * @returns {string|null}
   */
  get(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  },

  /**
   * Delete cookie
   * @param {string} name - Cookie name
   */
  remove(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  },
};
