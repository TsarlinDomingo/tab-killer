document
  .getElementById('save')
  .addEventListener(
    'click',
    function() {
      const timeoutValue = document.getElementById('timeout').value;
      const timeoutInMs = parseInt(timeoutValue) * 60000; // Convert to milliseconds
      
      chrome.storage.sync.set({ timeoutDuration: timeoutInMs }, function() {
        alert('Timeout duration saved!');
      });
    }
  );

// Load previously saved timeout and pause state
chrome.storage.sync.get(['timeoutDuration', 'isPaused'], function(data) {
  const savedTimeout = data.timeoutDuration ? data.timeoutDuration / 60000 : 10;
  document.getElementById('timeout').value = savedTimeout;
  
  if (data.isPaused) {
    updatePauseUI(true);
  }
});

function updatePauseUI(isPaused) {
  const toggleBtn = document.getElementById('togglePause');
  const statusTxt = document.getElementById('statusText');
  
  if (isPaused) {
    toggleBtn.textContent = 'Resume Auto-Close';
    statusTxt.textContent = 'Paused';
    statusTxt.style.color = 'red';
  } else {
    toggleBtn.textContent = 'Pause Auto-Close';
    statusTxt.textContent = 'Active';
    statusTxt.style.color = 'green';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const togglePauseBtn = document.getElementById('togglePause');
  
  togglePauseBtn.addEventListener('click', function() {
    chrome.storage.sync.get('isPaused', function(data) {
      const newPausedState = !data.isPaused;
      chrome.storage.sync.set({ isPaused: newPausedState }, function() {
        updatePauseUI(newPausedState);
      });
    });
  });

  const urlInput = document.getElementById('urlInput');
  const addURLButton = document.getElementById('addURL');
  const whitelistContainer = document.getElementById('whitelist');

  // --- QUICK ADD FEATURE LOGIC ---
  const quickAddBtn = document.getElementById('quickAddBtn');
  const quickAddOptions = document.getElementById('quickAddOptions');
  const optExact = document.getElementById('optExact');
  const optRoot = document.getElementById('optRoot');
  const optWildcard = document.getElementById('optWildcard');

  // Helper to get root domain (e.g. mail.google.co.uk -> google.co.uk)
  function getRootDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length <= 2) return hostname;
    
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];
    
    // Check for 2-letter country code preceded by co/com (e.g., .co.uk)
    if (last.length === 2 && (secondLast === 'co' || secondLast === 'com')) {
      return parts.slice(-3).join('.');
    }
    return parts.slice(-2).join('.');
  }

  // Toggle dropdown and populate options
  quickAddBtn.addEventListener('click', function() {
    if (quickAddOptions.style.display === 'block') {
      quickAddOptions.style.display = 'none';
      return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].url) {
        try {
          const urlObj = new URL(tabs[0].url);
          // Don't allow whitelisting internal chrome:// or extensions:// pages
          if (!urlObj.hostname) throw new Error('Invalid protocol');

          const exactDomain = urlObj.hostname;
          const rootDomain = getRootDomain(exactDomain);
          const wildcardDomain = `*.${rootDomain}`;

          // Populate buttons with data attributes and text
          optExact.textContent = `Exact Domain: ${exactDomain}`;
          optExact.dataset.rule = exactDomain;

          optRoot.textContent = `Root Domain: ${rootDomain}`;
          optRoot.dataset.rule = rootDomain;

          optWildcard.textContent = `Wildcard: ${wildcardDomain}`;
          optWildcard.dataset.rule = wildcardDomain;

          // If exact is same as root, hide the root option to avoid confusion
          optRoot.style.display = exactDomain === rootDomain ? 'none' : 'block';

          quickAddOptions.style.display = 'block';
        } catch (e) {
          alert('Cannot quick-add this type of page (e.g. New Tab or settings).');
        }
      }
    });
  });

  // Handle clicking one of the quick add option buttons
  function handleQuickAddSelection(event) {
    const rule = event.target.dataset.rule;
    if (rule) {
      chrome.storage.sync.get('whitelistedURLs', function(data) {
        const whitelistedURLs = data.whitelistedURLs || [];
        if (!whitelistedURLs.includes(rule)) {
          whitelistedURLs.push(rule);
          chrome.storage.sync.set({ whitelistedURLs }, function() {
            renderWhitelist();
            quickAddOptions.style.display = 'none';
          });
        } else {
          alert('This rule is already in your whitelist!');
        }
      });
    }
  }

  optExact.addEventListener('click', handleQuickAddSelection);
  optRoot.addEventListener('click', handleQuickAddSelection);
  optWildcard.addEventListener('click', handleQuickAddSelection);
  // --- END QUICK ADD LOGIC ---

  // Function to render the whitelist
  function renderWhitelist() {
    chrome.storage.sync.get('whitelistedURLs', function(data) {
      const whitelistedURLs = data.whitelistedURLs || [];
      whitelistContainer.innerHTML = ''; // Clear current list

      whitelistedURLs.forEach((url, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = url;
        
        // Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
          removeURLFromWhitelist(url);
        });

        listItem.appendChild(removeButton);
        whitelistContainer.appendChild(listItem);
      });
    });
  }

  // Add a URL to the whitelist
  addURLButton.addEventListener('click', function() {
    let url = urlInput.value.trim().toLowerCase();
    
    // Remove default protocol if user just typed the domain with it but meant the domain rule
    if ((url.startsWith('http://') || url.startsWith('https://')) && !url.substring(url.indexOf('//') + 2).includes('/')) {
        url = url.substring(url.indexOf('//') + 2);
    }

    if (url) {
      chrome.storage.sync.get('whitelistedURLs', function(data) {
        const whitelistedURLs = data.whitelistedURLs || [];
        if (!whitelistedURLs.includes(url)) {
          whitelistedURLs.push(url);
          chrome.storage.sync.set({ whitelistedURLs }, renderWhitelist);
        }
      });
      urlInput.value = ''; // clear input after adding
    }
  });

  // Remove a URL from the whitelist
  function removeURLFromWhitelist(url) {
    chrome.storage.sync.get('whitelistedURLs', function(data) {
      const whitelistedURLs = data.whitelistedURLs.filter(item => item !== url);
      chrome.storage.sync.set({ whitelistedURLs }, renderWhitelist);
    });
  }

  // Initial rendering of whitelist
  renderWhitelist();
});
