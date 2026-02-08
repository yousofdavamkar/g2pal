/**
 * Navigation Module
 * Handles active link detection in navigation
 */

/**
 * Set active nav link based on current page
 */
export function initActiveLinks() {
  const currentPath = window.location.pathname;

  // Desktop nav links
  const navLinks = document.querySelectorAll("header nav a");
  setActiveLinks(navLinks, currentPath, "nav-link");

  // Mobile nav links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  setActiveLinks(mobileNavLinks, currentPath, "text-gray-600", "dark:text-gray-300");
}

/**
 * Set active state on navigation links
 * @param {NodeList} links - Collection of link elements
 * @param {string} currentPath - Current page path
 * @param {...string} classesToRemove - Classes to remove when active
 */
function setActiveLinks(links, currentPath, ...classesToRemove) {
  links.forEach((link) => {
    const href = link.getAttribute("href");
    const dataPage = link.getAttribute("data-page");

    const isActive = isLinkActive(href || dataPage, currentPath);

    if (isActive) {
      link.classList.add("text-primary", "font-bold");
      classesToRemove.forEach(cls => link.classList.remove(cls));
    }
  });
}

/**
 * Check if a link is active based on current path
 * @param {string|null} href - Link href or data-page attribute
 * @param {string} currentPath - Current page path
 * @returns {boolean}
 */
function isLinkActive(href, currentPath) {
  if (!href) return false;

  return (
    href === currentPath ||
    (href === "/" && (currentPath === "/index.html" || currentPath === "/")) ||
    (href !== "/" && currentPath.includes(href))
  );
}
