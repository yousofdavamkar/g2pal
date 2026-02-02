import AOS from "aos";

const initServices = () => {
  // Draggable Sidebar Logic
  const slider = document.getElementById("services-sidebar");
  let isDown = false;
  let startX;
  let scrollLeft;
  let hasDragged = false; // متغیر برای تشخیص دراگ

  if (slider) {
    slider.addEventListener("pointerdown", (e) => {
      hasDragged = false; // اصلاح: همیشه در ابتدای کلیک وضعیت را ریست کن

      // Only allow mouse drag. Touch uses native scrolling.
      if (e.pointerType !== "mouse") return;

      isDown = true;
      slider.classList.add("cursor-grabbing");
      slider.classList.remove("cursor-grab");
      // Disable smooth scroll and snap for immediate response
      slider.classList.remove("scroll-smooth", "snap-x");
      startX = e.pageX;
      scrollLeft = slider.scrollLeft;
    });

    const stopDragging = (e) => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove("cursor-grabbing");
      slider.classList.add("cursor-grab");
      // Re-enable smooth scroll and snap
      slider.classList.add("scroll-smooth", "snap-x");
    };

    slider.addEventListener("pointerup", stopDragging);
    slider.addEventListener("pointerleave", stopDragging);

    slider.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;

      // تشخیص دراگ واقعی (حرکت بیش از 5 پیکسل)
      if (Math.abs(x - startX) > 5) {
        hasDragged = true;
      }

      const walk = (x - startX) * 1.5; // Slightly reduced speed for better control
      slider.scrollLeft = scrollLeft - walk;
    });

    // Prevent click if dragged
    slider.querySelectorAll(".service-category-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        // استفاده از متغیر hasDragged
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation(); // اطمینان از توقف کامل رویداد
        }
      });
    });

    // Add cursor-grab class initially
    slider.classList.add("cursor-grab");
  }

  const categoryLinks = document.querySelectorAll(".service-category-link");
  const serviceItems = document.querySelectorAll(
    ".service-card, .service-content",
  );

  // Classes for the active menu item
  const activeClasses = [
    "bg-primary",
    "text-white",
    "shadow-md",
    "shadow-primary/20",
  ];

  // Classes for inactive menu items
  const inactiveClasses = [
    "hover:text-primary",
    "hover:bg-gray-50",
    "dark:hover:bg-gray-800",
  ];

  function setActiveCategory(link) {
    // 1. Reset all links to inactive state
    categoryLinks.forEach((l) => {
      l.classList.remove(...activeClasses);
      l.classList.add(...inactiveClasses);

      // Reset icon colors
      const icon = l.querySelector("svg");
      if (icon) {
        icon.classList.add("text-gray-400", "group-hover:text-primary");
        // Remove any inline style if previously set (optional)
        icon.style.color = "";
      }
    });

    // 2. Set the clicked link to active state
    link.classList.remove(...inactiveClasses);
    link.classList.add(...activeClasses);

    // Update icon color for active state
    const activeIcon = link.querySelector("svg");
    if (activeIcon) {
      activeIcon.classList.remove("text-gray-400", "group-hover:text-primary");
    }
  }

  function filterCards(category) {
    serviceItems.forEach((item) => {
      const itemCategories = item.getAttribute("data-category") || "";
      const categories = itemCategories.split(" ");

      if (category === "all" || categories.includes(category)) {
        // Show item
        item.style.display = "";
        // Optional: Add a small fade-in animation
        item.style.opacity = "0";
        item.style.transform = "translateY(10px)";
        requestAnimationFrame(() => {
          item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        });
      } else {
        // Hide item
        item.style.display = "none";
      }
    });

    // Refresh AOS to recalculate positions
    if (window.AOS) {
      setTimeout(() => {
        window.AOS.refresh();
      }, 300); // Wait for transitions
    }
  }

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // اگر دراگ رخ داده باشد، کد زیر اجرا نمی‌شود
      if (hasDragged) return;

      e.preventDefault();
      const selectedCategory = link.getAttribute("data-category");

      setActiveCategory(link);
      filterCards(selectedCategory);

      // Clear search when changing category
      const searchInput = document.getElementById("service-search");
      if (searchInput) searchInput.value = "";
    });
  });

  // Trigger filter for the initially active category
  const activeLink = document.querySelector(
    ".service-category-link.bg-primary",
  );
  if (activeLink) {
    const category = activeLink.getAttribute("data-category");
    filterCards(category);
  }

  // Gift Cards Navigation Logic
  const gcNav = document.getElementById("gc-nav");
  const gcContent = document.getElementById("gc-content");
  const gcBackBtn = document.getElementById("gc-back-btn");
  const gcFolders = document.querySelectorAll(".gc-folder");
  const gcCategories = document.querySelectorAll(".gc-category");

  if (gcNav && gcContent) {
    // Open Category
    gcFolders.forEach((folder) => {
      folder.addEventListener("click", () => {
        const targetId = folder.getAttribute("data-target");
        const targetCategory = document.getElementById(targetId);

        if (targetCategory) {
          // Hide Nav, Show Content Wrapper
          gcNav.classList.add("hidden");
          gcContent.classList.remove("hidden");

          // Hide all categories, show target
          gcCategories.forEach((cat) => cat.classList.add("hidden"));
          targetCategory.classList.remove("hidden");

          // Scroll to top of content
          gcContent.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Back to Nav
    if (gcBackBtn) {
      gcBackBtn.addEventListener("click", () => {
        // Hide Content Wrapper, Show Nav
        gcContent.classList.add("hidden");
        gcNav.classList.remove("hidden");

        // Reset categories
        gcCategories.forEach((cat) => cat.classList.add("hidden"));
      });
    }
  }

  // Search Logic
  const searchInput = document.getElementById("service-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      // 1. Filter Service Cards (Financial, etc.)
      const serviceCards = document.querySelectorAll(".service-card");
      serviceCards.forEach((card) => {
        const text = card.innerText.toLowerCase();
        if (text.includes(query)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });

      // 2. Filter Gift Cards
      const gcContainer = document.querySelector(
        '.service-content[data-category="gift-cards"]',
      );
      const gcNav = document.getElementById("gc-nav");
      const gcContent = document.getElementById("gc-content");
      const gcCategories = document.querySelectorAll(".gc-category");
      const gcItems = document.querySelectorAll(".gc-category .group"); // The individual cards

      if (query.length > 0) {
        // Search Mode for Gift Cards
        let hasGcMatch = false;

        // Switch to Content View to show results
        if (gcNav) gcNav.classList.add("hidden");
        if (gcContent) gcContent.classList.remove("hidden");

        gcCategories.forEach((cat) => {
          let hasItemMatch = false;
          const items = cat.querySelectorAll(".group");
          items.forEach((item) => {
            const text = item.innerText.toLowerCase();
            if (text.includes(query)) {
              item.style.display = "";
              hasItemMatch = true;
              hasGcMatch = true;
            } else {
              item.style.display = "none";
            }
          });

          // Hide category header if no items match
          if (hasItemMatch) {
            cat.classList.remove("hidden");
            cat.style.display = "";
          } else {
            cat.classList.add("hidden");
            cat.style.display = "";
          }
        });

        // Force show Gift Cards container if matches found
        if (hasGcMatch) {
          if (gcContainer) gcContainer.style.display = "";
        } else {
          // Only hide if we are NOT in gift-cards category?
          // Actually, if search is active, we should hide non-matching containers.
          if (gcContainer) gcContainer.style.display = "none";
        }
      } else {
        // Clear Search - Restore State
        if (gcNav) gcNav.classList.remove("hidden");
        if (gcContent) gcContent.classList.add("hidden");

        // Reset Gift Card Items visibility
        gcItems.forEach((item) => (item.style.display = ""));
        gcCategories.forEach((cat) => {
          cat.style.display = "";
          cat.classList.add("hidden"); // Hide categories by default in folder view
        });

        // Re-run category filter to restore sidebar selection
        const activeLink = document.querySelector(
          ".service-category-link.bg-primary",
        );
        if (activeLink) {
          const category = activeLink.getAttribute("data-category");
          filterCards(category);
        }
      }
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(initServices);
    } else {
      setTimeout(initServices, 200);
    }
  });
} else {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initServices);
  } else {
    setTimeout(initServices, 200);
  }
}
