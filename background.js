let timeoutDuration = 60 * 60 * 1000; // Set the default to 1 hour
let activeTabs = {};
let whitelistedURLs = [];

function isTabWhitelisted(url) {
  return whitelistedURLs.some(whitelistedURL => url.includes(whitelistedURL));
}

// Function to close inactive tabs
function checkInactiveTabs() {
  console.log('Checking inactive tabs');
  const currentTime = Date.now();

  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(tab => {
      console.log('tab: ', tab);
      if (!activeTabs[tab.id]) {
        activeTabs[tab.id] = currentTime; // Initialize if not already
      }

      const inactiveTime = currentTime - activeTabs[tab.id];

      // Check if tab's URL is whitelisted before closing
      if (inactiveTime > timeoutDuration && !isTabWhitelisted(tab.url)) {
        chrome.tabs.remove(tab.id);
        delete activeTabs[tab.id];
      }
    });
  });
}

// Listen for tab activity and update the timestamp
chrome.tabs.onActivated.addListener(activeInfo => {
  activeTabs[activeInfo.tabId] = Date.now();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    activeTabs[tabId] = Date.now();
  }
});

// Periodically check for inactive tabs every minute
setInterval(checkInactiveTabs, 1 * 60 * 1000); 

chrome.storage.sync.get('timeoutDuration', function(data) {
  timeoutDuration = data.timeoutDuration || 600000; // Default to 10 minutes
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.timeoutDuration) {
    timeoutDuration = changes.timeoutDuration.newValue;
  }
});

// This will help keep the service worker alive for debugging
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'keepAlive') {
    sendResponse({ status: "Service worker is alive" });
  }
});

// Load whitelisted URLs from Chrome storage
chrome.storage.sync.get('whitelistedURLs', function(data) {
  if (data.whitelistedURLs) {
    whitelistedURLs = data.whitelistedURLs;
  }
});

// Function to add a URL to the whitelist
function addURLToWhitelist(url) {
  if (!whitelistedURLs.includes(url)) {
    whitelistedURLs.push(url);
    chrome.storage.sync.set({ whitelistedURLs });
  }
}

// Function to remove a URL from the whitelist
function removeURLFromWhitelist(url) {
  whitelistedURLs = whitelistedURLs.filter(item => item !== url);
  chrome.storage.sync.set({ whitelistedURLs });
}

console.log('timeoutDuration', timeoutDuration);
console.log('whitelistedURLs: ', whitelistedURLs);