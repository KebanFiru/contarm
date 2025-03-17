from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/receive', methods=['POST'])

def receive_slider_data():
    # Get the JSON data from the request body
    data = request.json
    
    # Extract slider value from the data (assuming the data sent has a "value" key)
    slider_value = data.get('value')

    if slider_value is None:
        return jsonify({"error": "No slider value received"}), 400
    
    # Process the slider value (you can add your logic here)
    print(f"Received slider value: {slider_value}")
    
    # Respond with a message or the processed data
    return jsonify({"message": "ON"})


if __name__ == '__main__':
    app.run()
