/**
 * Blog Carousel Feature Module
 * Handles Swiper carousel for blog articles
 */

import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

/**
 * Initialize blog carousel
 */
export function initBlogCarousel() {
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
}
