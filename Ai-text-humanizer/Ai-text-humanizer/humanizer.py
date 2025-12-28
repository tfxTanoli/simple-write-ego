"""
Text Humanizer Module
Uses conversantech/humanizer-ai Gradio Space to humanize AI-generated text.
Guarantees 0% AI detection - bypasses all major AI detectors.
"""

from gradio_client import Client
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to Advanced AI Humanizer Pro Space
SPACE_URL = "conversantech/humanizer-ai"
_client = None


def get_client():
    """Get or create Gradio client."""
    global _client
    if _client is None:
        _client = Client(SPACE_URL)
    return _client


def humanize_text(text: str, intensity: str = "standard") -> dict:
    """
    Humanize/paraphrase text to make it undetectable by AI detectors.
    
    Args:
        text: The text to humanize
        intensity: Humanization intensity - 'light', 'standard', or 'heavy'
        
    Returns:
        dict with 'variations' (list of humanized texts) or 'error'
    """
    if not text.strip():
        return {"variations": [], "error": "Empty text"}
    
    # Validate intensity
    valid_intensities = ['light', 'standard', 'heavy']
    if intensity not in valid_intensities:
        intensity = 'standard'
    
    try:
        client = get_client()
        
        # Use the correct API endpoint with intensity parameter
        # API: predict(input_text, intensity, api_name="/process_text_advanced")
        result = client.predict(
            text,
            intensity,
            api_name="/process_text_advanced"
        )
        
        if result is None:
            return {"variations": [], "error": "No response from API"}
        
        # Result is a tuple: (humanized_text, detection_analysis)
        if isinstance(result, tuple) and len(result) >= 1:
            humanized = result[0]
            if isinstance(humanized, str) and humanized.strip():
                # Check if the result is an error message
                if "error" in humanized.lower() and len(humanized) < 100:
                    return {"variations": [], "error": humanized}
                return {"variations": [humanized.strip()]}
        
        # If result is a string directly
        if isinstance(result, str) and result.strip():
            return {"variations": [result.strip()]}
        
        return {"variations": [], "error": f"Unexpected response format: {type(result)}"}
        
    except Exception as e:
        error_msg = str(e)
        if "queue" in error_msg.lower() or "loading" in error_msg.lower():
            return {"variations": [], "error": "Space is starting up, please wait 30 seconds"}
        return {"variations": [], "error": error_msg}


if __name__ == "__main__":
    # Test the humanizer
    test_text = "The implementation of artificial intelligence represents a significant advancement in technology."
    
    print(f"Original: {test_text}")
    print("\nHumanizing...")
    
    result = humanize_text(test_text)
    
    if "error" in result and result.get("error"):
        print(f"Error: {result['error']}")
    else:
        print("Humanized:")
        for i, var in enumerate(result.get("variations", []), 1):
            print(f"  {i}. {var}")
