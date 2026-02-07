/**
 * Video Player Feature Module
 * Handles custom video player with overlay controls
 */

/**
 * Initialize video player functionality
 */
export function initVideoPlayer() {
  const video = document.getElementById("main-video");
  const playBtn = document.getElementById("play-button");
  const overlay = document.getElementById("video-overlay");
  const badge = document.getElementById("video-badge");

  if (!video || !playBtn) return;

  // Play button click handler
  playBtn.addEventListener("click", () => {
    video.play();
    video.controls = true;
    if (overlay) overlay.classList.add("opacity-0", "pointer-events-none");
    if (badge) badge.classList.add("opacity-0");
  });

  // Video ended handler
  video.addEventListener("ended", () => {
    video.controls = false;
    if (overlay) overlay.classList.remove("opacity-0", "pointer-events-none");
    if (badge) badge.classList.remove("opacity-0");
    video.load();
  });
}
