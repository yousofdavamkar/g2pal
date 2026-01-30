export function init3DCardEffect() {
  // Disable 3D effect on mobile
  if (window.matchMedia("(max-width: 768px)").matches) return;

  const containers = document.querySelectorAll(".three-d-container");

  containers.forEach((container) => {
    const card = container.querySelector(".three-d-card");
    if (!card) return;

    // Set initial styles for 3D effect
    container.style.perspective = "1000px";
    card.style.transformStyle = "preserve-3d";

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation (max 15 degrees)
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0)";
      card.style.transition = "transform 0.5s ease-out";
    });

    container.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease-out";
    });
  });
}

// Initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(init3DCardEffect);
    } else {
      setTimeout(init3DCardEffect, 200);
    }
  });
} else {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(init3DCardEffect);
  } else {
    setTimeout(init3DCardEffect, 200);
  }
}
