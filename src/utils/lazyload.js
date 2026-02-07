// Lazy Loading Logic
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll(".lazy-image");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const picture = img.closest("picture");

        if (picture) {
          const sources = picture.querySelectorAll("source");
          sources.forEach((source) => {
            if (source.dataset.srcset) {
              source.srcset = source.dataset.srcset;
            }
          });
        }

        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        img.onload = () => {
          img.classList.remove("skeleton");
          // Refresh AOS to account for layout changes
          if (window.AOS) {
            window.AOS.refresh();
          }
        };

        // Handle cached images that might load instantly
        if (img.complete) {
          img.classList.remove("skeleton");
          if (window.AOS) {
            window.AOS.refresh();
          }
        }

        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => {
    imageObserver.observe(img);
  });
});
