/**
 * Features Module
 * Contains FAQ search, AOS initialization, and other feature modules
 */

import { deferred } from '../utils/animation-utils.js';

/**
 * Initialize FAQ search functionality
 */
export function initFaqSearch() {
  const faqSearchInput = document.getElementById("faq-search");
  if (!faqSearchInput) return;

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

/**
 * Initialize AOS (Animate On Scroll)
 */
export function initAOS() {
  if (!window.AOS) return;

  deferred(() => {
    window.AOS.init({
      mirror: false,
      duration: 800,
      once: true,
      disable: "mobile",
      offset: 120,
    });
  });
}

/**
 * Initialize blog carousel
 */
export function initBlogCarousel() {
  const blogCarousel = document.getElementById("blog-carousel");
  if (!blogCarousel) return;

  // Swiper is already loaded via main.js
  // This is a placeholder for any additional setup needed
}

/**
 * Initialize services slider
 */
export function initServicesSlider() {
  // Swiper initialization is handled in services.js
  // This is a placeholder for coordination if needed
}

/**
 * Initialize video player
 */
export function initVideoPlayer() {
  const videoPlayer = document.getElementById("video-player");
  if (!videoPlayer) return;

  // Video player setup if needed
}
