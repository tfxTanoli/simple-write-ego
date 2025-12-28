"""
AI Detection Module
Uses SzegedAI/AI_Detector Gradio Space to detect AI-generated text.
"""

from gradio_client import Client
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to SzegedAI Space
SPACE_URL = "SzegedAI/AI_Detector"
_client = None


def get_client():
    """Get or create Gradio client."""
    global _client
    if _client is None:
        # Public Space - no token needed
        _client = Client(SPACE_URL)
    return _client


def detect_ai(text: str) -> dict:
    """
    Detect if text is AI-generated using SzegedAI's ModernBERT detector.
    
    Args:
        text: The text to analyze
        
    Returns:
        dict with 'label' (AI-Generated/Human-Written) and 'confidence' (0-100%)
    """
    if not text.strip():
        return {"label": "Unknown", "confidence": 0, "error": "Empty text"}
    
    try:
        client = get_client()
        
        # Try different API endpoint names that Gradio Spaces commonly use
        api_names = ["/classify", "/analyze", "/detect", "/infer", None]
        result = None
        
        for api_name in api_names:
            try:
                if api_name:
                    result = client.predict(text, api_name=api_name)
                else:
                    # Let it use the default endpoint
                    result = client.predict(text)
                break
            except Exception as e:
                if "Cannot find a function" in str(e):
                    continue
                else:
                    raise e
        
        if result is None:
            return {"label": "Error", "confidence": 0, "error": "Could not find API endpoint"}
        
        # Parse result - the Space returns a label string like "AI" or "Human"
        # and possibly confidence scores
        if isinstance(result, str):
            label = result.strip()
            if "AI" in label.upper() or "ARTIFICIAL" in label.upper():
                return {
                    "label": "AI-Generated",
                    "confidence": 90.0,
                    "ai_probability": 90.0
                }
            else:
                return {
                    "label": "Human-Written",
                    "confidence": 90.0,
                    "ai_probability": 10.0
                }
        
        # If result is a tuple or list (label, confidence)
        if isinstance(result, (tuple, list)):
            if len(result) >= 2:
                label = str(result[0])
                try:
                    confidence = float(result[1]) * 100 if float(result[1]) <= 1 else float(result[1])
                except:
                    confidence = 90.0
                
                is_ai = "AI" in label.upper() or "ARTIFICIAL" in label.upper()
                return {
                    "label": "AI-Generated" if is_ai else "Human-Written",
                    "confidence": round(confidence, 1),
                    "ai_probability": round(confidence if is_ai else 100 - confidence, 1)
                }
            elif len(result) == 1:
                label = str(result[0])
                is_ai = "AI" in label.upper()
                return {
                    "label": "AI-Generated" if is_ai else "Human-Written",
                    "confidence": 90.0,
                    "ai_probability": 90.0 if is_ai else 10.0
                }
        
        # Fallback - try to parse as dict
        if isinstance(result, dict):
            label = result.get("label", result.get("prediction", "Unknown"))
            confidence = result.get("confidence", result.get("score", 0.9))
            if confidence <= 1:
                confidence *= 100
            is_ai = "AI" in str(label).upper()
            return {
                "label": "AI-Generated" if is_ai else "Human-Written",
                "confidence": round(confidence, 1),
                "ai_probability": round(confidence if is_ai else 100 - confidence, 1)
            }
        
        return {"label": "Unknown", "confidence": 0, "error": f"Unexpected response: {result}"}
        
    except Exception as e:
        error_msg = str(e)
        if "queue" in error_msg.lower():
            return {"label": "Loading", "confidence": 0, "error": "Space is starting up, please wait 30 seconds"}
        return {"label": "Error", "confidence": 0, "error": error_msg}


if __name__ == "__main__":
    # Test the detector
    test_texts = [
        "The implementation of artificial intelligence in modern healthcare systems represents a paradigm shift in medical diagnostics and patient care optimization.",
        "Hey man, wanna grab some pizza tonight? I'm starving lol"
    ]
    
    for text in test_texts:
        print(f"\nText: {text[:50]}...")
        result = detect_ai(text)
        print(f"Result: {result}")
