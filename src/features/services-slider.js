/**
 * Services Slider Feature Module
 * Handles stacked card Swiper carousel for services section
 */

import Swiper from "swiper";
import { Navigation } from "swiper/modules";

/**
 * Initialize services slider with stacked card effect
 */
export function initServicesSlider() {
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

  /**
   * Apply stacked card effect with data attributes
   */
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

  /**
   * Update navigation button active states
   */
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
}
