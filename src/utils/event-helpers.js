/**
 * Event Helper Functions
 * Helper functions for event handling and delegation
 */

/**
 * Add click event listener to element(s)
 * @param {string} selector - CSS selector
 * @param {Function} handler - Click handler function
 * @param {Object} options - Event listener options
 */
export function onClick(selector, handler, options = {}) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => el.addEventListener('click', handler, options));
}

/**
 * Add event listener to element(s)
 * @param {string} selector - CSS selector
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 * @param {Object} options - Event listener options
 */
export function on(selector, event, handler, options = {}) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => el.addEventListener(event, handler, options));
}

/**
 * Event delegation - add event listener to parent that delegates to children
 * @param {Element|string} container - Container element or selector
 * @param {string} selector - Child selector to delegate to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 */
export function delegate(container, selector, event, handler) {
  const parent = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!parent) return;

  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler.call(target, e);
    }
  });
}

/**
 * Add one-time event listener
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 * @param {Object} options - Event listener options
 */
export function once(element, event, handler, options = {}) {
  const wrapper = (e) => {
    handler(e);
    element.removeEventListener(event, wrapper, options);
  };
  element.addEventListener(event, wrapper, options);
}

/**
 * Remove event listener from element(s)
 * @param {string} selector - CSS selector
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 */
export function off(selector, event, handler) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => el.removeEventListener(event, handler));
}

/**
 * Trigger custom event on element
 * @param {Element} element - Target element
 * @param {string} eventName - Name of custom event
 * @param {*} detail - Event detail data
 * @param {Object} options - Event options
 */
export function trigger(element, eventName, detail = null, options = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: options.bubbles ?? true,
    cancelable: options.cancelable ?? true,
  });
  element.dispatchEvent(event);
}

/**
 * Prevent default behavior and stop propagation
 * @param {Event} event - Event object
 */
export function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Check if event target matches selector (event delegation helper)
 * @param {Event} event - Event object
 * @param {string} selector - CSS selector to match
 * @returns {Element|null}
 */
export function matchTarget(event, selector) {
  return event.target.closest(selector);
}

/**
 * Add keyboard event listener with key checking
 * @param {Element} element - Target element
 * @param {string|string[]} keys - Key(s) to listen for (e.g., 'Enter', 'Escape', ['Enter', ' '])
 * @param {Function} handler - Handler function
 */
export function onKey(element, keys, handler) {
  const keyArray = Array.isArray(keys) ? keys : [keys];

  element.addEventListener('keydown', (e) => {
    if (keyArray.includes(e.key)) {
      handler(e);
    }
  });
}

/**
 * Add escape key listener
 * @param {Element} element - Target element
 * @param {Function} handler - Handler function
 */
export function onEscape(element, handler) {
  onKey(element, 'Escape', handler);
}

/**
 * Add enter key listener
 * @param {Element} element - Target element
 * @param {Function} handler - Handler function
 */
export function onEnter(element, handler) {
  onKey(element, 'Enter', handler);
}

/**
 * Add click and enter key listeners (for accessibility)
 * @param {Element} element - Target element
 * @param {Function} handler - Handler function
 */
export function onClickOrEnter(element, handler) {
  onClick('#' + element.id, handler);
  onEnter(element, handler);
}

/**
 * Wait for element to be added to DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<Element>}
 */
export function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

/**
 * Focus trap helper for modals
 * @param {Element} container - Container element
 * @returns {Function} Cleanup function
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}
