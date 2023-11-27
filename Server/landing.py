from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import boto3
import json
from dotenv import load_dotenv
import os
import requests


# Loading environment variables from .env file
load_dotenv()
app = Flask(__name__)
CORS(app)

# Access environment variables
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
region_name = os.getenv('AWS_REGION')

# Setting up default session
boto3.setup_default_session(
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)

huggingface_api_key = os.getenv('HUGGINGFACE_API_TOKEN')
API_URL = "https://api-inference.huggingface.co/models/huggingtweets/dadsaysjokes"
headers = {"Authorization": f"Bearer {huggingface_api_key}"}

@app.route('/get-joke', methods=['POST'])
def get_joke():
    data = request.json
    age = data['age']
    joke_query = f"A short joke for {age} year old age:"

    payload = {"inputs": joke_query}
    response = requests.post(API_URL, headers=headers, json=payload)
    joke_data = response.json()

    joke_response = joke_data[0]['generated_text'] if joke_data else "Joke generation failed."
    print(joke_response)

    increment_fetch_joke_url = "https://nest.comp4537.com/stats/incrementFetchJoke"
    try:
        response = requests.get(increment_fetch_joke_url)  # You can customize the request method and headers if needed
        response.raise_for_status()  # Raises an HTTPError for bad responses
    except requests.exceptions.RequestException as e:
        print(f"Error making request to NestJS server: {e}")

    return jsonify(joke=joke_response)

# Initialize a SageMaker runtime client
sagemaker_runtime = boto3.client('sagemaker-runtime')

@app.route('/get-health-advice', methods=['POST'])
def get_health_tip():
    data = request.json
    age = data['age']
    health_tip_query = f"A health tip for {age} year old:"
    print(health_tip_query)

    # Sending the request to the SageMaker endpoint
    response = sagemaker_runtime.invoke_endpoint(
        EndpointName='huggingface-gpt2-alpaca', # SageMaker endpoint name
        ContentType='application/json',
        Body=json.dumps({'inputs': health_tip_query})
    )

    # Parse the response
    health_tip_response = json.loads(response['Body'].read().decode())
    generated_text = health_tip_response[0]['generated_text']  # Extract the generated text
    first_sentence = generated_text.split('.')[0] + '.'

    increment_fetch_joke_url = "https://nest.comp4537.com/stats/incrementGetHealthTip"
    try:
        response = requests.get(increment_fetch_joke_url)  # You can customize the request method and headers if needed
        response.raise_for_status()  # Raises an HTTPError for bad responses
    except requests.exceptions.RequestException as e:
        print(f"Error making request to NestJS server: {e}")

    return jsonify(advice=first_sentence)

if __name__ == '__main__':
    app.run(debug=True)
