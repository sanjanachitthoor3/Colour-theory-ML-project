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
 
     const imageData = ctx.getImageData(50, 50, 100, 100); // sample region
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
     localStorage.setItem("undertone", undertone);
     document.getElementById("result").innerText = `Detected undertone: ${undertone}`;
   };
 });
 
 function getUndertone(r, g, b) {
   if (r > b && g > b) return "warm";
   if (b > r && b > g) return "cool";
   return "neutral";
 }
 