// Import AOS for animations
import AOS from "aos";
import "aos/dist/aos.css";

// Import Swiper CSS for slider functionality
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Expose AOS to window for any legacy scripts that might need it
// @ts-ignore - AOS is added to window for legacy scripts
window.AOS = AOS;

// Import core initializer
import { initializer } from "./core/initializer.js";

// Import system modules
import { initPreloader } from "./modules/preloader.js";
import { initPartials } from "./modules/partials.js";
import { initTheme, initThemeToggle } from "./modules/theme.js";
import { initActiveLinks } from "./modules/navigation.js";
import { initMobileMenu } from "./modules/mobile-menu.js";
import { initDesktopDropdowns } from "./modules/dropdowns.js";

// Import feature modules
import { initFaqSearch } from "./features/faq-search.js";
import { initBlogCarousel } from "./features/blog-carousel.js";
import { initServicesSlider } from "./features/services-slider.js";
import { initVideoPlayer } from "./features/video-player.js";
import { initScrollSpy } from "./features/scroll-spy.js";
import { initServicesPage } from "./js/services.js";
import { initWhyGo2Pal } from "./js/why-go2pal.js";

// Import security and utilities
import "./security/trusted-types.js";
import "./utils/polyfills/flex-gap-polyfill.js";
import "./utils/lazyload.js";
import "./js/hero-scroll.js";
import "./js/scroll-animations.js";
import "./js/fullpage-snap.js";
import "./js/3d-card.js";

// Import all styles
import "./css/fonts.css";
import "./css/base.css";
import "./css/utilities.css";
import "./css/components.css";
import "./css/animations.css";
import "./css/features/hero-scroll.css";
import "./css/features/fullpage-snap.css";
import "./css/features/services-slider.css";
import "./css/features/why-go2pal.css";
import "./style.css";

/**
 * Initialize AOS with deferred timing
 */
async function initAOS() {
  AOS.init({
    mirror: false,
    duration: 800,
    once: true,
    disable: "mobile",
    offset: 120,
  });
}

/**
 * Initialize navbar components after partials are loaded
 * This function is called after initPartials completes
 */
async function initNavbarComponents() {
  initThemeToggle();
  initActiveLinks();
  initMobileMenu();
  initDesktopDropdowns();
}

/**
 * Custom initialization wrapper that handles partials loading
 */
async function initWithPartials() {
  // Load partials first
  const navbarLoaded = await initPartials();

  // Initialize navbar-dependent components
  if (navbarLoaded) {
    await initNavbarComponents();
  } else {
    // If navbar didn't load, still initialize other components
    initThemeToggle();
    initActiveLinks();
  }
}

// Register modules with priority (lower = earlier execution)
initializer.register("Preloader", initPreloader, 1);
initializer.register("Partials & Navbar", initWithPartials, 2);
initializer.register("Theme System", initTheme, 3);
initializer.register("Why Go2Pal", initWhyGo2Pal, 4);
initializer.register("FAQ Search", initFaqSearch, 5);
initializer.register("Blog Carousel", initBlogCarousel, 6);
initializer.register("Services Slider", initServicesSlider, 7);
initializer.register("Services Page", initServicesPage, 8);
initializer.register("Video Player", initVideoPlayer, 9);
initializer.register("Scroll Spy", initScrollSpy, 10);
initializer.register("AOS Animations", initAOS, 99); // Run AOS last after all other init

// Start the application
initializer.initAll().catch((error) => {
  console.error("Failed to initialize application:", error);
});
