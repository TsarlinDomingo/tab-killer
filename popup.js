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
