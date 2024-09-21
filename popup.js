document.getElementById('save').addEventListener('click', function() {
  const timeoutValue = document.getElementById('timeout').value;
  const timeoutInMs = parseInt(timeoutValue) * 60000; // Convert to milliseconds
  
  chrome.storage.sync.set({ timeoutDuration: timeoutInMs }, function() {
    alert('Timeout duration saved!');
  });
});

// Load previously saved timeout
chrome.storage.sync.get('timeoutDuration', function(data) {
  const savedTimeout = data.timeoutDuration / 60000;
  document.getElementById('timeout').value = savedTimeout || 10; // Default to 10 minutes if none set
});
