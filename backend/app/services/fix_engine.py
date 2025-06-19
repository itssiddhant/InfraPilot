import json
import requests
import re
import os

# Load the KB file only once
KB_PATH = os.path.join("kb", "kb.json")

if os.path.exists(KB_PATH):
    with open(KB_PATH, "r") as f:
        KB = json.load(f)
else:
    KB = []


def suggest_fix(summary: str) -> str:
    prompt = (
        f"You are an SRE agent. Based on this RCA summary, suggest an actionable fix or next step:\n\n"
        f"RCA Summary: {summary}\n\nFix (1-2 lines):"
    )
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "mistral", "prompt": prompt, "stream": False},
        )
        return response.json().get("response", "").strip() or "No fix suggested."
    except requests.exceptions.RequestException as e:
        return f"Fix generation failed: {str(e)}"

