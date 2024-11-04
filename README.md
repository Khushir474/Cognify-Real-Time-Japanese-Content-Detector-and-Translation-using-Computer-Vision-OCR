# Cognify  
### Real-Time Japanese Content Detector and Translation using Computer Vision OCR 🎌

![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) `Attention! While this project is focused on detection and translation of Japanese text and subtitles, future improvements include making this tool omni-lingual.`

**Unlocking Japanese Content with Real-Time OCR Magic!**

Cognify is a Python-based tool designed to help fans of Japanese content (anime, manga, etc.) overcome language barriers by offering real-time translation of Japanese text displayed on screen. By leveraging computer vision, Optical Character Recognition (OCR), and Googletrans, Cognify provides on-screen Japanese-to-English translations, allowing users to immerse themselves in Japanese media without the need for subtitles or dubbing.


## 🌟 Motivation

As a fan of Japanese content, I often found myself frustrated when English subtitles weren’t available. While various methods exist to learn the language, they rarely offer the immediate understanding needed to enjoy anime or manga in their raw format. This sparked the idea for **Cognify**, a tool that translates Japanese text in real time, allowing users to watch or read their favorite content with greater ease and depth of understanding.

---

## ✨ Features

- **Real-Time OCR**: Capture Japanese text directly from the screen.
- **On-Screen Translation**: Translate detected text from Japanese to English on the fly.
- **Computer Vision Integration**: Uses the `mss` package to detect any visible text on the screen.
- **Contextual Learning**: Learn Japanese naturally by seeing translations in context.
- **Extensibility**: Potential for additional language support in the future.

---

## 🔍 How It Works

Cognify uses a combination of tools to provide a seamless translation experience:
1. **Screen Capture with MSS**: Grabs the current screen display to capture any visible Japanese text.
2. **Tesseract OCR**: Recognizes and extracts Japanese characters from the screen capture.
3. **Googletrans**: A Python wrapper for Google Translate, translating Japanese text into English without the need for a Google Translate API key.

---

## 📋 Prerequisites

To use Cognify, you’ll need:
- **Python 3.7 or later**
- **MSS** (for screen capturing)
- **Tesseract OCR** installed on your machine
- **Googletrans** for translation

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/Cognify.git
   cd Cognify
   ```

2. Install the necessary packages: // Skip this step since all the requirements are in the main file included for now
   ```bash
   pip install -r requirements.txt
   ```

3. Set up Tesseract OCR:
   - [Download and install Tesseract](https://github.com/tesseract-ocr/tesseract/wiki).
   - Add Tesseract to your system PATH.

---

## 🚀 Usage

Run either of the scripts with the following command:
```bash
python main.py
```
```bash
python3 main.py
```

1. **Screen Capture**: The tool will automatically detect Japanese text appearing on screen.
2. **Real-Time Translation**: Translated text will be displayed in the output or overlay (depending on the UI configuration).
3. **Immersive Experience**: Enjoy Japanese content with translations at your fingertips!

---

## 🔧 Planned Improvements

Cognify is functional, but there's still room for growth! Future developments include:

- **Enhanced Text Recognition**: Improve accuracy for low-resolution or blurred text.
- **Multilingual Support**: Add support for translating other languages beyond Japanese and English.
- **User Interface**: Develop a streamlined user interface for easier setup and usage.
- **Mass Rollout**: Make Cognify more accessible for general users through optimized performance and user experience improvements.

---

## ⚠️ Limitations

Currently, Cognify may struggle with:
- Low-resolution text or complex font styles.
- Inconsistent accuracy in text recognition for non-standard text (e.g., decorative fonts in manga).

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any new features, bug fixes, or improvements.

---

## 📬 Contact

Feel free to reach out if you have questions, suggestions, or feedback! Connect with me on [LinkedIn](https://www.linkedin.com/in/khushir/) or submit an issue here on GitHub.

---

Unlock the world of Japanese media with **Cognify**—experience it all, barrier-free!
