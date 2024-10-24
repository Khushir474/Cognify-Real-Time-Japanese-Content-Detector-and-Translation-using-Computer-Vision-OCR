# # to download tesseract OCR, you need to check which compiler is used 
# # to build your python

# # use the following code to check your compiler:
# # import sys
# # print(sys.version)

# # to find the location of tesseract installed using MacPorts
# # it was a pain
# # a very unpopular answer on stack was the answer
# # $ port installed
# # $ port contents {insert entire package name with version from previous cmd}

# # Make sure you are connected to wifi

import cv2
import pytesseract
from googletrans import Translator
import numpy as np
import mss

# Configure Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/Cellar/tesseract/5.4.1_1/bin/tesseract'

# Initialize the translator
translator = Translator()

# Capture the screen using mss
with mss.mss() as sct:
    monitor = {"top": 750, "left": 350, "width": 3024, "height": 100}
    # "width": 800

    while True:
        # Capture the screen
        screenshot = np.array(sct.grab(monitor))
        frame = cv2.cvtColor(screenshot, cv2.COLOR_BGRA2BGR)

        # Convert image to grayscale for better OCR performance
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Apply some thresholding or blurring if needed
        gray = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)[1]

        # Detect and extract Japanese text using Tesseract
        custom_config = r'--oem 3 --psm 6 -l jpn'  # Tesseract config for Japanese text
        recognized_text = pytesseract.image_to_string(gray, config=custom_config)

        # Translate the recognized Japanese text to English
        if recognized_text.strip():
            translated_text = translator.translate(recognized_text, src='ja', dest='en').text
            print(f"Recognized Text: {recognized_text}")
            print(f"Translated Text: {translated_text}")

            # Display the translation on the frame
            cv2.putText(frame, translated_text, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Show the video feed with translations
        cv2.imshow("Translated Screen", frame)

        # Long Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
    #     cv2.destroyAllWindows()
    # cv2.destroyAllWindows()
cv2.destroyAllWindows()
