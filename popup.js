document.getElementById("analyzeBtn").addEventListener("click", () => {
  const file = document.getElementById("imageInput").files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(50, 50, 100, 100);
    const data = imageData.data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    const undertone = getUndertone(r, g, b);

    // Store in chrome.storage
    chrome.storage.local.set({ undertone }, () => {
      document.getElementById("result").innerText = `Detected undertone: ${undertone}`;

      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "applyFilter" });
      });
    });
  };
});

function getUndertone(r, g, b) {
  if (r > b && g > b) return "warm";
  if (b > r && b > g) return "cool";
  return "neutral";
}
