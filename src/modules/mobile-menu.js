/**
 * Mobile Menu Module
 * Handles mobile menu toggle with accessibility
 */

/**
 * Initialize mobile menu functionality
 */
export function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");

  if (!mobileMenuBtn || !mobileMenu) return;

  // Toggle menu function
  function toggleMenu() {
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);

    if (!isExpanded) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  // Open menu
  function openMenu() {
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("flex");
    mobileMenu.classList.remove("is-closing");
    requestAnimationFrame(() => {
      mobileMenu.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";
  }

  // Close menu
  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    mobileMenu.classList.add("is-closing");
    document.body.style.overflow = "";

    const onTransitionEnd = (event) => {
      if (event.propertyName !== "opacity") return;
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex", "is-closing");
      mobileMenu.removeEventListener("transitionend", onTransitionEnd);
    };

    mobileMenu.addEventListener("transitionend", onTransitionEnd);
  }

  // Event listeners
  mobileMenuBtn.addEventListener("click", toggleMenu);

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", toggleMenu);
  }

  // Close menu on link click
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
  });
}
