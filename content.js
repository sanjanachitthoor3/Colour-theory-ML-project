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
   return Math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2);
 }
 
 function isMatch(dominant, palette) {
   return palette.some(hex => colorDistance(dominant, hexToRgb(hex)) < 100);
 }
 
 // Load ColorThief (add colorthief.min.js to your folder)
 const colorThief = new ColorThief();
 
 setTimeout(() => {
   const tone = localStorage.getItem("undertone");
   const matches = palette[tone];
 
   document.querySelectorAll("img").forEach(img => {
     if (img.complete) {
       try {
         const dominant = colorThief.getColor(img);
         if (!isMatch(dominant, matches)) {
           img.style.filter = "grayscale(100%) opacity(40%)";
         } else {
           img.style.border = "2px solid green";
         }
       } catch (e) {
         console.log("Image skipped", e);
       }
     }
   });
 }, 3000); // wait for images to load
 