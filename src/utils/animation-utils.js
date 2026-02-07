/**
 * Animation Utilities
 * Helper functions for animations and transitions
 */

/**
 * Request animation frame with fallback
 * @param {Function} callback - Callback function
 * @returns {number}
 */
export function raf(callback) {
  return window.requestAnimationFrame(callback);
}

/**
 * Cancel animation frame
 * @param {number} id - Animation frame ID
 */
export function cancelRaf(id) {
  window.cancelAnimationFrame(id);
}

/**
 * Delay execution (promise-based)
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute callback during browser idle time
 * @param {Function} callback - Callback function
 * @param {Object} options - Idle callback options
 * @returns {number}
 */
export function deferred(callback, options = {}) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  // Fallback to setTimeout
  return setTimeout(callback, 100);
}

/**
 * Cancel deferred callback
 * @param {number} id - Callback ID
 */
export function cancelDeferred(id) {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Wait for transition to complete on element
 * @param {Element} element - Target element
 * @param {string} property - CSS property to wait for (default: all transitions)
 * @returns {Promise}
 */
export function waitForTransition(element, property = null) {
  return new Promise((resolve) => {
    const duration = getTransitionDuration(element, property);
    if (duration === 0) {
      resolve();
      return;
    }
    setTimeout(resolve, duration);
  });
}

/**
 * Get transition duration from computed styles
 * @param {Element} element - Target element
 * @param {string} property - CSS property to check
 * @returns {number}
 */
export function getTransitionDuration(element, property = null) {
  const styles = window.getComputedStyle(element);
  const durationStr = property
    ? styles.getPropertyValue(`transition-duration-${property}`)
    : styles.transitionDuration;

  const delayStr = property
    ? styles.getPropertyValue(`transition-delay-${property}`)
    : styles.transitionDelay;

  const duration = parseTime(durationStr);
  const delay = parseTime(delayStr);

  return duration + delay;
}

/**
 * Parse CSS time string to milliseconds
 * @param {string} timeStr - CSS time value (e.g., '300ms', '0.3s')
 * @returns {number}
 */
export function parseTime(timeStr) {
  if (!timeStr || timeStr === 'none') return 0;
  const match = timeStr.match(/^([\d.]+)(ms|s)?$/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const unit = match[2] || 'ms';
  return unit === 's' ? value * 1000 : value;
}

/**
 * Animate element using Web Animations API
 * @param {Element} element - Target element
 * @param {Object} keyframes - Keyframes object
 * @param {Object} options - Animation options
 * @returns {Animation}
 */
export function animate(element, keyframes, options = {}) {
  return element.animate(keyframes, {
    duration: 300,
    easing: 'ease',
    fill: 'forwards',
    ...options,
  });
}

/**
 * Fade in animation
 * @param {Element} element - Target element
 * @param {number} duration - Duration in ms
 * @returns {Animation}
 */
export function fadeIn(element, duration = 300) {
  return animate(
    element,
    [
      { opacity: 0 },
      { opacity: 1 },
    ],
    { duration }
  );
}

/**
 * Fade out animation
 * @param {Element} element - Target element
 * @param {number} duration - Duration in ms
 * @returns {Animation}
 */
export function fadeOut(element, duration = 300) {
  return animate(
    element,
    [
      { opacity: 1 },
      { opacity: 0 },
    ],
    { duration }
  );
}

/**
 * Slide in from direction
 * @param {Element} element - Target element
 * @param {string} direction - Direction: 'up', 'down', 'left', 'right'
 * @param {number} distance - Distance in px
 * @param {number} duration - Duration in ms
 * @returns {Animation}
 */
export function slideIn(element, direction = 'up', distance = 20, duration = 300) {
  const keyframes = {
    up: [{ transform: `translateY(${distance}px)`, opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
    down: [{ transform: `translateY(-${distance}px)`, opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
    left: [{ transform: `translateX(${distance}px)`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
    right: [{ transform: `translateX(-${distance}px)`, opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
  };

  return animate(element, keyframes[direction] || keyframes.up, { duration });
}

/**
 * Scale animation
 * @param {Element} element - Target element
 * @param {number} from - Start scale
 * @param {number} to - End scale
 * @param {number} duration - Duration in ms
 * @returns {Animation}
 */
export function scale(element, from = 0.8, to = 1, duration = 300) {
  return animate(
    element,
    [
      { transform: `scale(${from})`, opacity: from < 1 ? 0 : 1 },
      { transform: `scale(${to})`, opacity: 1 },
    ],
    { duration }
  );
}

/**
 * Bounce animation
 * @param {Element} element - Target element
 * @param {number} duration - Duration in ms
 * @returns {Animation}
 */
export function bounce(element, duration = 500) {
  return animate(
    element,
    [
      { transform: 'scale(1, 1)' },
      { transform: 'scale(1.1, 0.9)' },
      { transform: 'scale(0.9, 1.1)' },
      { transform: 'scale(1.05, 0.95)' },
      { transform: 'scale(1, 1)' },
    ],
    { duration, easing: 'ease-in-out' }
  );
}

/**
 * Shake animation
 * @param {Element} element - Target element
 * @param {number} intensity - Shake intensity in px
 * @param {number} duration - Duration in ms
 * @returns {Animation}
 */
export function shake(element, intensity = 10, duration = 300) {
  return animate(
    element,
    [
      { transform: 'translateX(0)' },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(0)' },
    ],
    { duration }
  );
}

/**
 * Pulse animation
 * @param {Element} element - Target element
 * @param {number} scale - Scale amount
 * @param {number} duration - Duration in ms
 * @returns {Animation}
 */
export function pulse(element, scale = 1.05, duration = 300) {
  return animate(
    element,
    [
      { transform: 'scale(1)' },
      { transform: `scale(${scale})` },
      { transform: 'scale(1)' },
    ],
    { duration }
  );
}

/**
 * Loop animation with control
 * @param {Function} animateFn - Animation function to call each frame
 * @param {Function} condition - Condition to continue looping
 * @returns {Object} Control object with start/stop methods
 */
export function loopAnimation(animateFn, condition) {
  let rafId;
  let running = false;

  const loop = () => {
    if (!running || !condition()) {
      running = false;
      return;
    }
    animateFn();
    rafId = requestAnimationFrame(loop);
  };

  return {
    start: () => {
      if (!running) {
        running = true;
        loop();
      }
    },
    stop: () => {
      running = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    },
    isRunning: () => running,
  };
}

/**
 * Measure frame rate
 * @param {number} samples - Number of samples to collect
 * @returns {Promise<number>} Average FPS
 */
export function measureFPS(samples = 60) {
  return new Promise((resolve) => {
    let frameCount = 0;
    let lastTime = performance.now();

    function measure() {
      frameCount++;
      const now = performance.now();

      if (frameCount >= samples) {
        const fps = Math.round((samples / (now - lastTime)) * 1000);
        resolve(fps);
        return;
      }

      requestAnimationFrame(measure);
    }

    requestAnimationFrame(measure);
  });
}
