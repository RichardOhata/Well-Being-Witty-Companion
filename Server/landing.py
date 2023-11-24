from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import jwt
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__)
CORS(app, supports_credentials=True)

# Load the text generation pipeline with the specified model
generator = pipeline('text-generation', model='huggingtweets/dadsaysjokes')

model_name = "vicgalle/gpt2-alpaca"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# jwt_secret_key = os.getenv('JWT_SECRET_KEY')
# if jwt_secret_key is None:
#     raise ValueError("JWT_SECRET_KEY environment variable is not set")

# def verify_token(token):
#     try:
#         data = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
#         return data
#     except jwt.ExpiredSignatureError:
#         print("Token has expired")
#         return None
#     except jwt.InvalidTokenError as e:
#         print(f"Invalid token: {e}")
#         return None
#     except Exception as e:
#         print(f"An error occurred during token verification: {e}")
#         return None

@app.route('/get-joke', methods=['POST'])
def get_joke():
    # Verify the token
    # token = request.cookies.get('access_token')
    # print("Received token: ", token)

    # if not token:
    #     return jsonify(error="No token provided"), 401
    
    # token_data = verify_token(token)
    # print("Token data: ", token_data)

    # if token_data is None:
    #     return jsonify({'message': 'Token is invalid or expired'}), 401

    data = request.json
    age = data['age']
    joke_query = f"A short joke for {age} year old age:"
    jokes = generator(joke_query, num_return_sequences=1)
    joke_response = jokes[0]['generated_text']

    return jsonify(joke=joke_response)

@app.route('/get-health-advice', methods=['POST'])
def get_health_tip():
    data = request.json
    age = data['age']
    health_tip_query = f"A health tip for {age} year old:"
    print(health_tip_query)

    # Encode the input text and generate a health tip
    input_ids = tokenizer.encode(health_tip_query, return_tensors="pt")
    output = model.generate(input_ids, max_length=100, num_return_sequences=1, pad_token_id=tokenizer.eos_token_id)
    health_tip_response = tokenizer.decode(output[0], skip_special_tokens=True)

    # Limit the response to a single line
    health_tip_response = health_tip_response.split('\n')[0]

    return jsonify(advice=health_tip_response)

if __name__ == '__main__':
    app.run(debug=True)
