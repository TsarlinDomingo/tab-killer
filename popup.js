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

// Load previously saved timeout
chrome.storage.sync.get('timeoutDuration', function(data) {
  const savedTimeout = data.timeoutDuration / 60000;
  document.getElementById('timeout').value = savedTimeout || 10; // Default to 10 minutes if none set
});

document.addEventListener('DOMContentLoaded', function() {
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
    const url = urlInput.value.trim();
    if (url) {
      chrome.storage.sync.get('whitelistedURLs', function(data) {
        const whitelistedURLs = data.whitelistedURLs || [];
        if (!whitelistedURLs.includes(url)) {
          whitelistedURLs.push(url);
          chrome.storage.sync.set({ whitelistedURLs }, renderWhitelist);
        }
      });
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
