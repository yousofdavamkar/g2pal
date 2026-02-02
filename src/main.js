import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./security/trusted-types.js";
import "./fonts.css";
import "./style.css";
import "./hero-scroll.css";
import "./services-slider.css";
import "./flexboxgapsupport.js";
import "./js/hero-scroll.js";
import "./lazyload.js";
import "./js/services.js";
import "./js/3d-card.js";
import AOS from "aos";
import "aos/dist/aos.css";

// Expose AOS to window for other scripts
window.AOS = AOS;

// ========================================
// SMART PRELOADER LOGIC
// ========================================
(function initPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const isMobile = window.innerWidth < 768;

  const hidePreloader = () => {
    preloader.classList.add("hidden");
    document.body.classList.remove("loading");
  };

  // Mobile: Disable preloader completely, show content immediately
  if (isMobile) {
    hidePreloader();
    return;
  }

  // Desktop: Keep preloader with 3 second hard timeout
  const HARD_TIMEOUT = 3000;
  let preloaderHidden = false;

  const safeHidePreloader = () => {
    if (preloaderHidden) return;
    preloaderHidden = true;
    hidePreloader();
  };

  // Hard timeout - removes preloader after 3s no matter what
  const timeoutId = setTimeout(safeHidePreloader, HARD_TIMEOUT);

  // Also hide on window load (if it fires before timeout)
  window.addEventListener("load", () => {
    clearTimeout(timeoutId);
    safeHidePreloader();
  });
})();

// ========================================
// PARTIALS LOADING SYSTEM
// ========================================
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

async function initPartials() {
  const navbarLoaded = await loadPartial(
    "navbar-container",
    "/partials/navbar.html",
  );
  const footerLoaded = await loadPartial(
    "footer-container",
    "/partials/footer.html",
  );

  // Re-initialize navbar components after load
  if (navbarLoaded) {
    initThemeToggle();
    initMobileMenu();
    setActiveNavLink();
    initDesktopDropdowns();
  }
}

// Set active nav link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname;

  // Desktop nav links
  const navLinks = document.querySelectorAll("header nav a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isActive =
      href === currentPath ||
      (href === "/" &&
        (currentPath === "/index.html" || currentPath === "/")) ||
      (href !== "/" && currentPath.includes(href));

    if (isActive) {
      link.classList.add("text-primary", "font-bold");
      link.classList.remove("nav-link");
    }
  });

  // Mobile nav links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const dataPage = link.getAttribute("data-page");
    const isActive =
      href === currentPath ||
      dataPage === currentPath ||
      (href === "/" &&
        (currentPath === "/index.html" || currentPath === "/")) ||
      (dataPage === "/" &&
        (currentPath === "/index.html" || currentPath === "/")) ||
      (href !== "/" && href !== "" && currentPath.includes(href));

    if (isActive) {
      link.classList.add("text-primary", "font-bold");
      link.classList.remove("text-gray-600", "dark:text-gray-300");
    }
  });
}

// ========================================
// THEME TOGGLE LOGIC
// ========================================
function initThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle");

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      // Toggle the class
      document.documentElement.classList.toggle("dark");

      // Save preference
      if (document.documentElement.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
      } else {
        localStorage.setItem("theme", "light");
      }
    });
  }
}

// Initialize theme on load (backup for inline script)
if (localStorage.getItem("theme") === "dark" || !("theme" in localStorage)) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// ========================================
// MOBILE MENU LOGIC
// ========================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuClose = document.getElementById("mobile-menu-close");

  function toggleMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;

    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);

    if (!isExpanded) {
      mobileMenu.classList.remove("hidden");
      mobileMenu.classList.add("flex");
      mobileMenu.classList.remove("is-closing");
      requestAnimationFrame(() => {
        mobileMenu.classList.add("is-open");
      });
      document.body.style.overflow = "hidden";
      return;
    }

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

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", toggleMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", toggleMenu);
  }
}

// ========================================
// DESKTOP DROPDOWN / MEGA MENU LOGIC
// ========================================
function initDesktopDropdowns() {
  const dropdownItems = Array.from(
    document.querySelectorAll("[data-dropdown]"),
  );

  if (!dropdownItems.length) return;

  let closeTimeout;

  const closeAll = (exceptItem = null) => {
    dropdownItems.forEach((item) => {
      if (item === exceptItem) return;
      item.classList.remove("is-open");
      const trigger = item.querySelector("[data-dropdown-trigger]");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  };

  const openItem = (item) => {
    closeAll(item);
    item.classList.add("is-open");
    const trigger = item.querySelector("[data-dropdown-trigger]");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }
  };

  const closeItem = (item) => {
    item.classList.remove("is-open");
    const trigger = item.querySelector("[data-dropdown-trigger]");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  };

  dropdownItems.forEach((item) => {
    const trigger = item.querySelector("[data-dropdown-trigger]");

    item.addEventListener("mouseenter", () => {
      if (window.innerWidth < 1024) return;
      clearTimeout(closeTimeout);
      openItem(item);
    });

    item.addEventListener("mouseleave", () => {
      if (window.innerWidth < 1024) return;
      closeTimeout = setTimeout(() => closeItem(item), 160);
    });

    item.addEventListener("focusin", () => {
      if (window.innerWidth < 1024) return;
      openItem(item);
    });

    item.addEventListener("focusout", (event) => {
      if (window.innerWidth < 1024) return;
      if (!item.contains(event.relatedTarget)) {
        closeItem(item);
      }
    });

    if (trigger) {
      trigger.addEventListener("click", (event) => {
        if (window.innerWidth < 1024) return;
        event.preventDefault();
        if (item.classList.contains("is-open")) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth < 1024) return;
    if (!event.target.closest("[data-dropdown]")) {
      closeAll();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeAll();
  });

  window.addEventListener("resize", () => closeAll());
}

// FAQ Search Logic
const faqSearchInput = document.getElementById("faq-search");
if (faqSearchInput) {
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  const faqCards = Array.from(document.querySelectorAll(".faq-card"));
  const faqSummaries = faqItems.map((item) => {
    const summary = item.querySelector("summary");
    const body = item.querySelector("div");
    const text = `${summary?.textContent || ""} ${body?.textContent || ""}`
      .trim()
      .toLowerCase();
    return { item, text };
  });

  faqSearchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    faqSummaries.forEach(({ item, text }) => {
      const match = query.length === 0 || text.includes(query);
      item.style.display = match ? "" : "none";
      if (!match && item.hasAttribute("open")) {
        item.removeAttribute("open");
      }
    });

    faqCards.forEach((card) => {
      const hasVisibleItem = Array.from(
        card.querySelectorAll(".faq-item"),
      ).some((item) => item.style.display !== "none");
      card.style.display = hasVisibleItem ? "" : "none";
    });
  });
}

// Defer AOS initialization
const initAOS = () => {
  AOS.init({
    mirror: false,
    duration: 800,
    once: true,
    disable: "mobile",
    offset: 120,
  });
};

if ("requestIdleCallback" in window) {
  requestIdleCallback(initAOS);
} else {
  setTimeout(initAOS, 100);
}

// Blog Carousel Logic
const initBlogCarousel = () => {
  const blogContainer = document.querySelector(".blog-swiper");
  if (!blogContainer) return;

  new Swiper(blogContainer, {
    modules: [Navigation, Pagination],
    slidesPerView: 1,
    spaceBetween: 16,
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1024: {
        slidesPerView: 4,
      },
    },
    pagination: {
      el: "#blog-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#blog-next",
      prevEl: "#blog-prev",
    },
  });
};

// Services Slider Logic (Stacked Cards with RTL Support)
const initServicesSlider = () => {
  const servicesContainer = document.querySelector(".services-swiper");
  if (!servicesContainer) return null;

  const prevBtn = document.getElementById("services-slider-prev");
  const nextBtn = document.getElementById("services-slider-next");

  const servicesSwiper = new Swiper(servicesContainer, {
    modules: [Navigation],

    // Core settings
    slidesPerView: "auto",
    spaceBetween: 24,
    speed: 500,
    grabCursor: true,
    watchSlidesProgress: true,

    // Allow navigating to last slides by adding small offset at the end
    slidesOffsetAfter: 0,

    // Disable features we don't need
    loop: false,
    centeredSlides: false,
    freeMode: false,

    // Navigation - swapped for RTL (prev/next are visually reversed)
    navigation: {
      nextEl: prevBtn,
      prevEl: nextBtn,
    },

    // Responsive breakpoints

    // Event handlers
    on: {
      init: function (swiper) {
        updateNavButtonStyles(swiper);
        applyStackedEffect(swiper);
      },
      slideChange: function (swiper) {
        updateNavButtonStyles(swiper);
        applyStackedEffect(swiper);
      },
      reachBeginning: updateNavButtonStyles,
      reachEnd: updateNavButtonStyles,
      progress: function (swiper) {
        applyStackedEffect(swiper);
      },
    },
  });

  // Apply stacked card effect with data attributes
  function applyStackedEffect(swiper) {
    const slides = swiper.slides;
    const activeIndex = swiper.activeIndex;
    const visibleCount = Math.ceil(swiper.params.slidesPerView) + 1;

    slides.forEach((slide, index) => {
      const diff = index - activeIndex;

      if (diff < 0) {
        // Passed slides (scrolled out to the right in RTL)
        slide.setAttribute("data-slide-state", "passed");
      } else if (diff === 0) {
        // Active slide
        slide.setAttribute("data-slide-state", "active");
      } else if (diff <= visibleCount) {
        // Visible upcoming slides
        slide.setAttribute("data-slide-state", `visible-${Math.min(diff, 4)}`);
      } else {
        // Far ahead slides - still visible but lower priority
        slide.setAttribute("data-slide-state", "visible-4");
      }
    });
  }

  // Update navigation button active states
  function updateNavButtonStyles(swiper) {
    // For RTL: "prev" button navigates forward (to end), "next" navigates backward (to start)
    if (prevBtn) {
      const canGoForward = !swiper.isEnd;
      prevBtn.classList.toggle("services-nav-btn--active", canGoForward);
      prevBtn.disabled = !canGoForward;
      prevBtn.setAttribute("aria-disabled", String(!canGoForward));
    }

    if (nextBtn) {
      const canGoBack = !swiper.isBeginning;
      nextBtn.classList.toggle("services-nav-btn--active", canGoBack);
      nextBtn.disabled = !canGoBack;
      nextBtn.setAttribute("aria-disabled", String(!canGoBack));
    }
  }

  return servicesSwiper;
};

// Video Player Logic
const initVideoPlayer = () => {
  const video = document.getElementById("main-video");
  const playBtn = document.getElementById("play-button");
  const overlay = document.getElementById("video-overlay");
  const badge = document.getElementById("video-badge");

  if (video && playBtn) {
    playBtn.addEventListener("click", () => {
      video.play();
      video.controls = true;
      if (overlay) overlay.classList.add("opacity-0", "pointer-events-none");
      if (badge) badge.classList.add("opacity-0");
    });

    video.addEventListener("ended", () => {
      video.controls = false;
      if (overlay) overlay.classList.remove("opacity-0", "pointer-events-none");
      if (badge) badge.classList.remove("opacity-0");
      video.load();
    });
  }
};

// ScrollSpy Logic
const initScrollSpy = () => {
  const navLinks = document.querySelectorAll(".rules-nav-link");
  if (navLinks.length === 0) return;

  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute("href").substring(1);
      return document.getElementById(id);
    })
    .filter((section, index, self) => {
      // Filter duplicates (since we have mobile and desktop links pointing to same sections)
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
};

// Initialize all non-critical components
const initAll = () => {
  initBlogCarousel();
  initServicesSlider();
  initVideoPlayer();
  initScrollSpy();
};

// Main initialization
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", async () => {
    // Load partials first
    await initPartials();

    // Then initialize other components
    if ("requestIdleCallback" in window) {
      requestIdleCallback(initAll);
    } else {
      setTimeout(initAll, 200);
    }
  });
} else {
  // DOM already loaded
  initPartials().then(() => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(initAll);
    } else {
      setTimeout(initAll, 200);
    }
  });
}
