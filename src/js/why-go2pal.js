export function initWhyGo2Pal() {
  const container = document.querySelector(".why-section");
  if (!container) return;

  // Particle system
  const particlesContainer = container.querySelector(".why-particles");
  if (particlesContainer && particlesContainer.children.length === 0) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "why-particle";

      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";

      const tx = (Math.random() - 0.5) * 400;
      const ty = (Math.random() - 0.5) * 400;
      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");

      particle.style.animationDelay = Math.random() * 20 + "s";
      particle.style.animationDuration = Math.random() * 10 + 15 + "s";

      particlesContainer.appendChild(particle);
    }
  }

  // Mouse parallax effect for background cards
  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return; // Disable on mobile

    const cards = container.querySelectorAll(".why-card");
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    cards.forEach((card, index) => {
      const speed = (index + 1) * 2; // Reduced speed for subtlety
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;

      if (!card.matches(":hover")) {
        // We use transform directly, but we need to preserve the initial 3d layout if any
        // But here we apply simple parallax translation.
        // Using CSS custom properties might be cleaner but direct style works.
        // Note: The tilt effect is separate.
        card.style.transform = `translateX(${x}px) translateY(${y}px)`;
      }
    });
  };

  container.addEventListener("mousemove", handleMouseMove);

  // Reset transform when mouse leaves section
  container.addEventListener("mouseleave", () => {
    const cards = container.querySelectorAll(".why-card");
    cards.forEach((card) => {
      // Reset only if not handling tilt
      if (!card.matches(":hover")) {
        card.style.transform = "";
      }
    });
  });

  // 3D Tilt Effect
  const cards = container.querySelectorAll(".why-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // RTL text direction doesn't affect coordinate system of element
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15; // rotateY is inverted for visual expected behavior

      // Apply 3D rotation
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}
