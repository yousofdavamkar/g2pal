/**
 * Centralized Initialization System
 * Manages the registration and execution order of all application modules
 */

import { deferred } from '../utils/animation-utils.js';

class Initializer {
  constructor() {
    /** @type {Array<{name: string, initFn: Function, priority: number}>} */
    this.modules = [];
    this.isReady = false;
    this.isInitialized = false;
  }

  /**
   * Register a module for initialization
   * @param {string} name - Module name for logging
   * @param {Function} initFn - Initialization function (can be async)
   * @param {number} priority - Priority (lower = earlier execution)
   */
  register(name, initFn, priority = 10) {
    this.modules.push({ name, initFn, priority });
    // Sort by priority (lower numbers execute first)
    this.modules.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Initialize all registered modules
   * @returns {Promise<void>}
   */
  async initAll() {
    if (this.isInitialized) {
      console.warn('Initializer: Already initialized');
      return;
    }

    console.group('🚀 Initializing Go2Pal Application');

    try {
      // Wait for DOM to be ready
      await this.domReady();
      console.log('✓ DOM ready');

      // Initialize modules by priority
      for (const module of this.modules) {
        const startTime = performance.now();
        try {
          await module.initFn();
          const duration = Math.round(performance.now() - startTime);
          console.log(`✓ ${module.name} initialized (${duration}ms)`);
        } catch (error) {
          console.error(`✗ ${module.name} failed:`, error);
        }
      }

      this.isInitialized = true;
      console.log('✓ All modules initialized');
      console.groupEnd();
    } catch (error) {
      console.error('Fatal initialization error:', error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Wait for DOM to be ready
   * @returns {Promise<void>}
   */
  domReady() {
    if (this.isReady) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (document.readyState !== 'loading') {
        this.isReady = true;
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          this.isReady = true;
          resolve();
        });
      }
    });
  }

  /**
   * Get initialization status
   * @returns {boolean}
   */
  getStatus() {
    return {
      isReady: this.isReady,
      isInitialized: this.isInitialized,
      moduleCount: this.modules.length,
    };
  }

  /**
   * Get list of registered modules
   * @returns {Array<{name: string, priority: number}>}
   */
  getModules() {
    return this.modules.map(m => ({ name: m.name, priority: m.priority }));
  }
}

// Export singleton instance
export const initializer = new Initializer();

/**
 * Convenience function to register a module
 * @param {string} name - Module name
 * @param {Function} initFn - Initialization function
 * @param {number} priority - Priority (lower = earlier)
 */
export function registerModule(name, initFn, priority = 10) {
  initializer.register(name, initFn, priority);
}

/**
 * Convenience function to start initialization
 * @returns {Promise<void>}
 */
export async function initApp() {
  await initializer.initAll();
}
