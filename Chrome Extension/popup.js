
document.addEventListener('DOMContentLoaded', function() {
const enableCheckbox = document.getElementById('enableTranslation');
const statusDiv = document.getElementById('status');

// Load saved state
chrome.storage.local.get(['enabled'], function(result) {
    enableCheckbox.checked = result.enabled || false;
});

// Save state when checkbox is toggled
enableCheckbox.addEventListener('change', function() {
    chrome.storage.local.set({ enabled: this.checked });
    
    if (this.checked) {
    statusDiv.textContent = 'Translation enabled';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'enable'});
    });
    } else {
    statusDiv.textContent = 'Translation disabled';
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'disable'});
    });
    }
});
});

