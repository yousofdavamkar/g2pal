/**
 * Desktop Dropdowns Module
 * Handles desktop navigation dropdown/mega menu logic
 */

/**
 * Initialize desktop dropdown functionality
 */
export function initDesktopDropdowns() {
  const dropdownItems = Array.from(
    document.querySelectorAll("[data-dropdown]"),
  );

  if (!dropdownItems.length) return;

  let closeTimeout;

  /**
   * Close all dropdowns except one
   */
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

  /**
   * Open a dropdown item
   */
  const openItem = (item) => {
    closeAll(item);
    item.classList.add("is-open");
    const trigger = item.querySelector("[data-dropdown-trigger]");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "true");
    }
  };

  /**
   * Close a dropdown item
   */
  const closeItem = (item) => {
    item.classList.remove("is-open");
    const trigger = item.querySelector("[data-dropdown-trigger]");
    if (trigger) {
      trigger.setAttribute("aria-expanded", "false");
    }
  };

  // Setup each dropdown item
  dropdownItems.forEach((item) => {
    const trigger = item.querySelector("[data-dropdown-trigger]");

    // Mouse enter - open dropdown
    item.addEventListener("mouseenter", () => {
      if (window.innerWidth < 1024) return;
      clearTimeout(closeTimeout);
      openItem(item);
    });

    // Mouse leave - close dropdown with delay
    item.addEventListener("mouseleave", () => {
      if (window.innerWidth < 1024) return;
      closeTimeout = setTimeout(() => closeItem(item), 160);
    });

    // Focus in - open dropdown
    item.addEventListener("focusin", () => {
      if (window.innerWidth < 1024) return;
      openItem(item);
    });

    // Focus out - close dropdown
    item.addEventListener("focusout", (event) => {
      if (window.innerWidth < 1024) return;
      if (!item.contains(event.relatedTarget)) {
        closeItem(item);
      }
    });

    // Click on trigger - toggle dropdown
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

  // Click outside - close all dropdowns
  document.addEventListener("click", (event) => {
    if (window.innerWidth < 1024) return;
    if (!event.target.closest("[data-dropdown]")) {
      closeAll();
    }
  });

  // Escape key - close all dropdowns
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeAll();
  });

  // Window resize - close all dropdowns
  window.addEventListener("resize", () => closeAll());
}
