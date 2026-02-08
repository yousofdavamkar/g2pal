/**
 * Scroll Spy Feature Module
 * Handles active section tracking in navigation based on scroll position
 */

/**
 * Initialize scroll spy functionality
 */
export function initScrollSpy() {
  const navLinks = document.querySelectorAll(".rules-nav-link");
  if (navLinks.length === 0) return;

  // Get unique sections from links
  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute("href").substring(1);
      return document.getElementById(id);
    })
    .filter((section, index, self) => {
      // Filter duplicates (mobile and desktop links point to same sections)
      return section !== null && self.indexOf(section) === index;
    });

  // Add click handlers for smooth scrolling and URL cleaning
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("href").substring(1);
      const target = document.getElementById(id);
      if (target) {
        // Calculate offset for fixed header (approx 100px)
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Update active link immediately
        updateActiveLink(id);
      }
    });
  });

  // Intersection Observer for scroll tracking
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        updateActiveLink(id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  /**
   * Update active state for all navigation links
   */
  function updateActiveLink(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href").substring(1);
      const isMobile = link.classList.contains("mobile-link");

      if (href === id) {
        // Active State
        if (isMobile) {
          link.classList.add(
            "bg-primary",
            "text-white",
            "border-primary",
            "shadow-lg",
            "shadow-primary/30",
          );
          link.classList.remove(
            "bg-white",
            "dark:bg-gray-800",
            "text-gray-600",
            "dark:text-gray-300",
            "border-gray-200",
            "dark:border-gray-700",
          );
          // Scroll mobile nav to center active item
          link.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        } else {
          // Desktop Active
          link.classList.add("text-primary", "bg-primary/5", "font-medium");
          link.classList.remove(
            "text-gray-500",
            "hover:text-gray-900",
            "dark:text-gray-400",
            "dark:hover:text-white",
            "hover:bg-gray-50",
            "dark:hover:bg-gray-800",
          );
        }
      } else {
        // Inactive State
        if (isMobile) {
          link.classList.remove(
            "bg-primary",
            "text-white",
            "border-primary",
            "shadow-lg",
            "shadow-primary/30",
          );
          link.classList.add(
            "bg-white",
            "dark:bg-gray-800",
            "text-gray-600",
            "dark:text-gray-300",
            "border-gray-200",
            "dark:border-gray-700",
          );
        } else {
          // Desktop Inactive
          link.classList.remove("text-primary", "bg-primary/5", "font-medium");
          link.classList.add(
            "text-gray-500",
            "hover:text-gray-900",
            "dark:text-gray-400",
            "dark:hover:text-white",
            "hover:bg-gray-50",
            "dark:hover:bg-gray-800",
          );
        }
      }
    });
  }
}
