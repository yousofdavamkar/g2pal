/**
 * Partials Module
 * Handles loading of navbar and footer partials
 */

/**
 * Load a partial HTML file into an element
 * @param {string} elementId - Target element ID
 * @param {string} filePath - Path to partial file
 * @returns {Promise<boolean>}
 */
async function loadPartial(elementId, filePath) {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await response.text();
    element.innerHTML = html;
    return true;
  } catch (error) {
    console.error(`Error loading partial: ${filePath}`, error);
    return false;
  }
}

/**
 * Initialize all partials (navbar and footer)
 */
export async function initPartials() {
  const navbarLoaded = await loadPartial(
    "navbar-container",
    "/partials/navbar.html",
  );
  await loadPartial(
    "footer-container",
    "/partials/footer.html",
  );

  // Re-initialize navbar components after load
  if (navbarLoaded) {
    // Initialize modules that depend on navbar being loaded
    // These will be registered in main.js
    return true;
  }

  return false;
}
