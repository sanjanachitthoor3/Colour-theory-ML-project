// This is your background service worker
// It waits for messages or actions and responds (does not run all the time)

chrome.runtime.onInstalled.addListener(() => {
   console.log("SkinTone Styler Extension Installed");
 });
 
 // Listen for messages from popup.js or content.js
 chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   if (message.type === "analyzeSkinTone") {
     // You can process or forward the data here
     console.log("Received skin tone data:", message.data);
 
     // Optionally inject scripts into the current page
     chrome.scripting.executeScript({
       target: { tabId: sender.tab.id },
       files: ["content.js"]
     });
 
     // Respond back if needed
     sendResponse({ status: "success", message: "Skin tone data received." });
   }
 
   return true; // Required if using async sendResponse
 });
 