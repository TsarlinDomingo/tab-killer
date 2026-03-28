// Function to check if a URL is whitelisted
function isTabWhitelisted(url, whitelistedURLs) {
  if (!url) return false;
  return whitelistedURLs.some(whitelistedURL => url.includes(whitelistedURL));
}

// Function to close inactive tabs
async function checkInactiveTabs() {
  console.log('Checking inactive tabs via Alarm');
  const currentTime = Date.now();

  try {
    // Fetch state from storage instead of global variables
    const localData = await chrome.storage.local.get(['activeTabs']);
    const syncData = await chrome.storage.sync.get(['timeoutDuration', 'whitelistedURLs']);
    
    let activeTabs = localData.activeTabs || {};
    let timeoutDuration = syncData.timeoutDuration || 600000; // Default: 10 mins
    let whitelistedURLs = syncData.whitelistedURLs || [];

    chrome.tabs.query({}, function(tabs) {
      let tabsUpdated = false;

      tabs.forEach(tab => {
        if (!activeTabs[tab.id]) {
          activeTabs[tab.id] = currentTime; // Initialize if not already
          tabsUpdated = true;
        }

        const inactiveTime = currentTime - activeTabs[tab.id];

        // Check if tab's URL is whitelisted before closing
        if (inactiveTime > timeoutDuration && !isTabWhitelisted(tab.url, whitelistedURLs)) {
          console.log(`Closing inactive tab: ${tab.url}`);
          chrome.tabs.remove(tab.id);
          delete activeTabs[tab.id];
          tabsUpdated = true;
        }
      });

      // Save updated timestamps back to storage
      if (tabsUpdated) {
        chrome.storage.local.set({ activeTabs });
      }
    });
  } catch (err) {
    console.error("Error checking tabs:", err);
  }
}

// Listen for tab activity and update the timestamp in storage
chrome.tabs.onActivated.addListener(async activeInfo => {
  const data = await chrome.storage.local.get(['activeTabs']);
  let activeTabs = data.activeTabs || {};
  activeTabs[activeInfo.tabId] = Date.now();
  await chrome.storage.local.set({ activeTabs });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const data = await chrome.storage.local.get(['activeTabs']);
    let activeTabs = data.activeTabs || {};
    activeTabs[tabId] = Date.now();
    await chrome.storage.local.set({ activeTabs });
  }
});

// Clean up storage when a tab is closed manually to prevent bloat
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const data = await chrome.storage.local.get(['activeTabs']);
  let activeTabs = data.activeTabs || {};
  if (activeTabs[tabId]) {
    delete activeTabs[tabId];
    await chrome.storage.local.set({ activeTabs });
  }
});

// Setup the Chrome Alarm to replace setInterval
chrome.runtime.onInstalled.addListener(() => {
  // Create an alarm to fire every 1 minute
  chrome.alarms.create('checkTabsAlarm', { periodInMinutes: 1 });
});

// Listen for the Alarm and trigger the check
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkTabsAlarm') {
    checkInactiveTabs();
  }
});

// Keep Alive handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'keepAlive') {
    sendResponse({ status: "Service worker is alive" });
  }
});
