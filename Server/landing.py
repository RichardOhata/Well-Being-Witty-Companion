from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import OpenAIGPTTokenizer, OpenAIGPTLMHeadModel
import torch

app = Flask(__name__)
CORS(app)

# Load the model and tokenizer
model_name = "openai-gpt"
tokenizer = OpenAIGPTTokenizer.from_pretrained(model_name)
model = OpenAIGPTLMHeadModel.from_pretrained(model_name)

@app.route('/get-joke', methods=['POST'])
def get_joke():
    data = request.json
    age = data['age']
    joke_query = f"Tell me a joke suitable for someone aged {age}."

    # Generate a response using the model
    inputs = tokenizer.encode(joke_query, return_tensors="pt")
    outputs = model.generate(inputs, max_length=50)  # Adjust max_length as needed
    joke_response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify(joke=joke_response)

if __name__ == '__main__':
    app.run(debug=True)
