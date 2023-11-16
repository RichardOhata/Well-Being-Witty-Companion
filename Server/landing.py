
from flask import Flask, request, jsonify
from flask_cors import CORS  # Corrected import
import requests

app = Flask(__name__)
CORS(app)

@app.route('/get-joke', methods=['POST'])
def get_joke():
    data = request.json
    age = data['age']
    joke_query = f"Tell me a joke suitable for someone aged {age}."

    response = requests.post(
        "https://api-inference.huggingface.co/models/openai-gpt",
        headers={"Authorization": "Bearer your_api_token"},
        json={"inputs": joke_query}
    )

    print("Received data:", data)
    print("Hugging Face API Response:", response.json())


    # Check if the response is successful
    if response.status_code != 200:
        return jsonify(error="Failed to get response from Hugging Face API"), 500

    response_data = response.json()

    # Check if the expected data is present
    if not response_data or 'generated_text' not in response_data[0]:
        return jsonify(error="Unexpected response format"), 500

    joke_response = response_data[0]['generated_text']
    return jsonify(joke=joke_response)

if __name__ == '__main__':
    app.run(debug=True)