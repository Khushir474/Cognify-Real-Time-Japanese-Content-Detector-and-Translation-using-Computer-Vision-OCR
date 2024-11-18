class CognifyTranslator {
constructor() {
    this.enabled = false;
    this.translator = null;
    this.observer = null;
    this.lastTranslated = new Map();
    
    // Initialize translation service
    this.initializeTranslator();
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'enable') {
        this.enable();
    } else if (request.action === 'disable') {
        this.disable();
    }
    });
}

async initializeTranslator() {
    // Using Google Translate API
    this.translator = {
    translate: async (text) => {
        try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();
        return data[0][0][0];
        } catch (error) {
        console.error('Translation error:', error);
        return text;
        }
    }
    };
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

    // Process existing content
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

    // Skip if node is a translation overlay
    if (node.classList?.contains('cognify-translation')) return;

    const textNodes = this.getTextNodes(node);
    for (const textNode of textNodes) {
    const text = textNode.textContent.trim();
    if (this.isJapanese(text) && !this.lastTranslated.has(textNode)) {
        const translation = await this.translator.translate(text);
        if (translation && translation !== text) {
        this.showTranslation(textNode, translation);
        this.lastTranslated.set(textNode, translation);
        }
    }
    }
}

getTextNodes(node) {
    const textNodes = [];
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let currentNode;
    while (currentNode = walk.nextNode()) {
    textNodes.push(currentNode);
    }
    return textNodes;
}

isJapanese(text) {
    // Basic check for Japanese characters
    return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/.test(text);
}

showTranslation(node, translation) {
    const rect = node.parentElement.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.classList.add('cognify-translation');
    overlay.style.cssText = `
    position: absolute;
    top: ${rect.bottom}px;
    left: ${rect.left}px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10000;
    pointer-events: none;
    `;
    overlay.textContent = translation;
    document.body.appendChild(overlay);
}

removeTranslations() {
    document.querySelectorAll('.cognify-translation').forEach(el => el.remove());
    this.lastTranslated.clear();
}
}

// Initialize the translator
const cognify = new CognifyTranslator();

