# from TTS.api import TTS

# # Load model once
# tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC")

# def speak(text):
#     print("AI:", text)
#     tts.tts_to_file(text=text, file_path="output.wav")

#     import os
#     os.system("start output.wav")  # Windows


import pyttsx3

engine = pyttsx3.init()

# Optional tuning
engine.setProperty('rate', 170)   # speed
engine.setProperty('volume', 1.0) # volume

def speak(text):
    print("AI:", text)
    engine.say(text)
    engine.runAndWait()