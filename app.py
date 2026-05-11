import webbrowser
from threading import Timer
from flask import Flask, render_template, request, jsonify
from Password_Generator import generate_password

# --- Flask Web Server ---
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    length = data.get('length', 16)
    use_letters = data.get('use_letters', True)
    use_numbers = data.get('use_numbers', True)
    use_symbols = data.get('use_symbols', True)

    try:
        # Calling logic from Password_Generator.py
        password = generate_password(length, use_letters, use_numbers, use_symbols)
        return jsonify({'password': password})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000")

if __name__ == '__main__':
    print("Starting VaultGen Premium UI...")
    print("Opening browser at http://127.0.0.1:5000")
    
    # Wait 1.5 seconds before opening the browser to ensure the server is ready
    Timer(1.5, open_browser).start()
    
    # Run Flask
    app.run(debug=False, port=5000)
