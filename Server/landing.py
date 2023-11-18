from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load the text generation pipeline with the specified model
generator = pipeline('text-generation', model='huggingtweets/dadsaysjokes')

@app.route('/get-joke', methods=['POST'])
def get_joke():
    data = request.json
    age = data['age']
    joke_query = f"A short joke for {age} year old age:"

    # Generate a response using the pipeline
    jokes = generator(joke_query, num_return_sequences=1)

    # The pipeline returns a list of dictionaries, extract the generated text
    joke_response = jokes[0]['generated_text']

    return jsonify(joke=joke_response)

if __name__ == '__main__':
    app.run(debug=True)
