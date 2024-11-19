// uncomment the below two lines and add in the relevant keys:
// const GOOGLE_TRANSLATE_API_KEY = 'your_api_key_here';
// window.GOOGLE_TRANSLATE_API_KEY = GOOGLE_TRANSLATE_API_KEY;

class CognifyTranslator {
    constructor() {
      this.enabled = false;
      this.cache = new Map();
      this.observer = null;
      this.setupMessageListeners();
    }
  
    setupMessageListeners() {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'enable') {
          this.enable();
        } else if (request.action === 'disable') {
          this.disable();
        }
      });
    }
  
    enable() {
      if (this.enabled) return;
      this.enabled = true;
      this.startObserving();
    }
  
    disable() {
      if (!this.enabled) return;
      this.enabled = false;
      this.stopObserving();
      this.removeTranslations();
    }
  
    startObserving() {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          this.processNode(mutation.target);
        });
      });
  
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
  
      this.processNode(document.body);
    }
  
    stopObserving() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }
  
    async processNode(node) {
      if (!this.enabled) return;
      if (node.classList?.contains('cognify-translation')) return;
  
      const textNodes = this.getTextNodes(node);
      for (const textNode of textNodes) {
        const text = textNode.textContent.trim();
        if (this.isJapanese(text) && !this.cache.has(textNode)) {
          const translation = await this.translate(text);
          if (translation) {
            this.showTranslation(textNode, translation);
            this.cache.set(textNode, translation);
          }
        }
      }
    }
  
    getTextNodes(node) {
      const textNodes = [];
      const walk = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
  
      let currentNode;
      while (currentNode = walk.nextNode()) {
        textNodes.push(currentNode);
      }
      return textNodes;
    }
  
    isJapanese(text) {
      return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(text);
    }
  
    async translate(text) {
      if (!text.trim()) return null;
      
      const apiKey = window.GOOGLE_TRANSLATE_API_KEY;
      if (!apiKey) {
        console.error('Translation API key not found');
        return null;
      }
  
      try {
        const response = await fetch(
          `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: text,
              source: 'ja',
              target: 'en',
              format: 'text'
            })
          }
        );
  
        const data = await response.json();
        if (data.data && data.data.translations) {
          return data.data.translations[0].translatedText;
        }
        return null;
      } catch (error) {
        console.error('Translation error:', error);
        return null;
      }
    }
  
    showTranslation(node, translation) {
      const rect = node.parentElement.getBoundingClientRect();
      const overlay = document.createElement('div');
      overlay.className = 'cognify-translation';
      overlay.style.cssText = `
        position: absolute;
        top: ${window.scrollY + rect.bottom}px;
        left: ${window.scrollX + rect.left}px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        pointer-events: none;
        animation: fadeIn 0.3s ease-in-out;
      `;
      overlay.textContent = translation;
      document.body.appendChild(overlay);
    }
  
    removeTranslations() {
      document.querySelectorAll('.cognify-translation').forEach(el => el.remove());
      this.cache.clear();
    }
  }
  
  // Initialize the translator
  const cognify = new CognifyTranslator();