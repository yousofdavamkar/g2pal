import policy from "../security/trusted-types.js";

/**
 * Safely sets the innerHTML of an element using the Trusted Types policy.
 * @param {HTMLElement} element - The target DOM element.
 * @param {string} htmlString - The HTML string to insert.
 */
export function setSafeHTML(element, htmlString) {
  if (!element) return;

  // Use the policy to create a TrustedHTML object
  // Even with a 'default' policy, using this explicitly is better for clarity and "Zero Trust" intent.
  const safeHTML = policy.createHTML(htmlString);

  element.innerHTML = safeHTML;
}
