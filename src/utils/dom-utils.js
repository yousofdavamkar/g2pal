/**
 * DOM Utility Functions
 * Helper functions for DOM manipulation and querying
 */

/**
 * Query selector - returns first matching element
 * @param {string} selector - CSS selector
 * @param {ParentNode} parent - Parent element to search within (default: document)
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query selector all - returns all matching elements
 * @param {string} selector - CSS selector
 * @param {ParentNode} parent - Parent element to search within (default: document)
 * @returns {NodeList}
 */
export function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Add CSS classes to an element
 * @param {Element} element - Target element
 * @param {...string} classes - Class names to add
 */
export function addClass(element, ...classes) {
  element?.classList.add(...classes);
}

/**
 * Remove CSS classes from an element
 * @param {Element} element - Target element
 * @param {...string} classes - Class names to remove
 */
export function removeClass(element, ...classes) {
  element?.classList.remove(...classes);
}

/**
 * Toggle a CSS class on an element
 * @param {Element} element - Target element
 * @param {string} className - Class name to toggle
 * @param {boolean} force - Force add (true) or remove (false)
 */
export function toggleClass(element, className, force) {
  element?.classList.toggle(className, force);
}

/**
 * Check if element has a class
 * @param {Element} element - Target element
 * @param {string} className - Class name to check
 * @returns {boolean}
 */
export function hasClass(element, className) {
  return element?.classList.contains(className) ?? false;
}

/**
 * Set data attribute on element
 * @param {Element} element - Target element
 * @param {string} key - Data key (without 'data-')
 * @param {string} value - Value to set
 */
export function setData(element, key, value) {
  element?.setAttribute(`data-${key}`, value);
}

/**
 * Get data attribute from element
 * @param {Element} element - Target element
 * @param {string} key - Data key (without 'data-')
 * @returns {string|null}
 */
export function getData(element, key) {
  return element?.getAttribute(`data-${key}`);
}

/**
 * Remove data attribute from element
 * @param {Element} element - Target element
 * @param {string} key - Data key (without 'data-')
 */
export function removeData(element, key) {
  element?.removeAttribute(`data-${key}`);
}

/**
 * Set inline styles on an element
 * @param {Element} element - Target element
 * @param {Object} styles - Style properties object
 */
export function setStyles(element, styles) {
  if (!element) return;
  Object.assign(element.style, styles);
}

/**
 * Get element's bounding rectangle
 * @param {Element} element - Target element
 * @returns {DOMRect|null}
 */
export function getBounds(element) {
  return element?.getBoundingClientRect() ?? null;
}

/**
 * Check if element is visible in viewport
 * @param {Element} element - Target element
 * @param {number} threshold - Visibility threshold (0-1)
 * @returns {boolean}
 */
export function isInViewport(element, threshold = 0) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

  return vertInView && horInView;
}
