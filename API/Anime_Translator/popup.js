document.addEventListener('DOMContentLoaded', function() {
    const enableCheckbox = document.getElementById('enableTranslation');
    const statusDiv = document.getElementById('status');
  
    // Load saved state
    chrome.storage.local.get(['enabled'], function(result) {
      enableCheckbox.checked = result.enabled || false;
    });
  
    // Save state when checkbox is toggled
    enableCheckbox.addEventListener('change', function() {
      const enabled = this.checked;
      chrome.storage.local.set({ enabled });
      
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: enabled ? 'enable' : 'disable'
        });
      });
  
      statusDiv.textContent = `Translation ${enabled ? 'enabled' : 'disabled'}`;
      setTimeout(() => statusDiv.textContent = '', 2000);
    });
  });