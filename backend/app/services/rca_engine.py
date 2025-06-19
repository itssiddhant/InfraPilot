import requests

def generate_rca(logs):
    prompt = (
        "You are an infrastructure SRE. Analyze and summarize the root cause of these logs:\n\n" +
        "\n".join(logs[-10:]) +
        "\n\nProvide an RCA summary in plain English."
    )

    response = requests.post("http://localhost:11434/api/generate", json={
        "model": "mistral", 
        "prompt": prompt,
        "stream": False
    })

    return response.json()["response"].strip()