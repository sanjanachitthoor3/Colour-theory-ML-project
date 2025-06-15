const palette = {
  warm: ['#FF5733', '#FFC300', '#FF8D1A'],
  cool: ['#1A75FF', '#8000FF', '#66B2FF'],
  neutral: ['#999999', '#A67B5B', '#C0C0C0']
};

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function colorDistance(c1, c2) {
  return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}

function isMatch(dominant, palette) {
  return palette.some(hex => colorDistance(dominant, hexToRgb(hex)) < 100);
}

function processImages(undertone) {
  const colorThief = new ColorThief();
  const matches = palette[undertone];
  if (!matches) return;

  document.querySelectorAll("img").forEach(img => {
    const isSafe = img.src.startsWith("data:") || img.crossOrigin === "anonymous";
    if (!img.complete || img.naturalWidth === 0 || !isSafe) return;

    try {
      const dominant = colorThief.getColor(img, 5);
      if (!isMatch(dominant, matches)) {
        img.style.filter = "grayscale(100%) opacity(40%)";
      } else {
        img.style.border = "2px solid green";
      }
    } catch (e) {
      console.warn("Skipped image due to error:", e.message);
    }
  });
}

// Listen for popup message
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "applyFilter") {
    chrome.storage.local.get("undertone", (res) => {
      if (res.undertone) {
        processImages(res.undertone);
      }
    });
  }
});
