# AI Text Humanizer

A desktop application to detect AI-generated text and humanize it using Hugging Face models.

## Features

- 🔍 **AI Detection** - Detect if text is AI-generated using RoBERTa model
- ✨ **Humanization** - Rewrite AI text to sound more natural using T5 paraphrase model
- 🎨 **Modern Dark UI** - Clean, professional interface

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the app:**
   ```bash
   python main.py
   ```

## Usage

1. Paste your text in the left panel
2. Click **"Detect AI"** to check if it's AI-generated
3. Click **"Humanize"** to get natural-sounding variations
4. Copy the result using the copy button

## Notes

- First API call may take 20-30 seconds as models warm up
- Requires internet connection (uses Hugging Face cloud API)
- Free tier has rate limits - wait a few seconds between requests if you hit limits

## Models Used

- **Detection:** `openai-community/roberta-base-openai-detector`
- **Humanization:** `Vamsi/T5_Paraphrase_Paws`
