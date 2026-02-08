/**
 * FAQ Search Feature Module
 * Handles search functionality for FAQ sections
 */

/**
 * Initialize FAQ search functionality
 */
export function initFaqSearch() {
  const faqSearchInput = document.getElementById("faq-search");
  if (!faqSearchInput) return;

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  const faqCards = Array.from(document.querySelectorAll(".faq-card"));

  // Build search index
  const faqSummaries = faqItems.map((item) => {
    const summary = item.querySelector("summary");
    const body = item.querySelector("div");
    const text = `${summary?.textContent || ""} ${body?.textContent || ""}`
      .trim()
      .toLowerCase();
    return { item, text };
  });

  // Search input handler
  faqSearchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();

    // Filter FAQ items
    faqSummaries.forEach(({ item, text }) => {
      const match = query.length === 0 || text.includes(query);
      item.style.display = match ? "" : "none";
      if (!match && item.hasAttribute("open")) {
        item.removeAttribute("open");
      }
    });

    // Hide/show FAQ cards based on visible items
    faqCards.forEach((card) => {
      const hasVisibleItem = Array.from(
        card.querySelectorAll(".faq-item"),
      ).some((item) => item.style.display !== "none");
      card.style.display = hasVisibleItem ? "" : "none";
    });
  });
}
