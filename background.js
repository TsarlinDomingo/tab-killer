let timeoutDuration = 600000; // Set the default to 10 minutes (600,000 ms)
let activeTabs = {};

// Function to close inactive tabs
function checkInactiveTabs() {
  chrome.tabs.query({}, function(tabs) {
    const currentTime = Date.now();
    
    tabs.forEach(tab => {
      if (activeTabs[tab.id]) {
        const inactiveTime = currentTime - activeTabs[tab.id];
        if (inactiveTime > timeoutDuration) {
          chrome.tabs.remove(tab.id);
          delete activeTabs[tab.id]; // Remove from tracking
        }
      } else {
        activeTabs[tab.id] = currentTime; // Initialize tracking if not already
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

// Periodically check for inactive tabs
setInterval(checkInactiveTabs, 60000); // Every minute

chrome.storage.sync.get('timeoutDuration', function(data) {
  timeoutDuration = data.timeoutDuration || 600000; // Default to 10 minutes
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.timeoutDuration) {
    timeoutDuration = changes.timeoutDuration.newValue;
  }
});