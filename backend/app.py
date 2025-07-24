from flask import Flask, render_template, request, session
from flask_cors import CORS
import random
import time

app = Flask(__name__)
app.secret_key = 'supersecret'
CORS(app)

# Dummy passages (replace with your real passages)
PASSAGES = [
    "The quick brown fox jumps over the lazy dog.",
    "Flask makes web development simple and fun.",
    "Typing speed tests help improve your accuracy and speed."
]

# ------------------------------
# Show typing test
@app.route('/', methods=['GET'])
def index():
    text = random.choice(PASSAGES)
    session['current_text'] = text
    session['start_time'] = time.time()
    return render_template('index.html', text=text)

# ------------------------------
# Handle submitted text
@app.route('/result', methods=['POST'])
def result():
    typed_text = request.form.get('typed_text', '').strip()
    if not typed_text:
        return "Please type something!", 400

    end_time = time.time()
    start_time = session.get('start_time')
    target_text = session.get('current_text')

    if not start_time or not target_text:
        return "Session expired. Please try again.", 400

    time_taken = end_time - start_time
    time_in_minutes = time_taken / 60
    word_count = len(target_text.split())
    wpm = word_count / time_in_minutes if time_in_minutes > 0 else 0

    correct_chars = sum(1 for i, c in enumerate(typed_text) if i < len(target_text) and c == target_text[i])
    accuracy = (correct_chars / len(target_text)) * 100 if len(target_text) > 0 else 0

    return render_template('result.html',
                           time_taken=f"{time_taken:.2f}",
                           wpm=f"{wpm:.2f}",
                           accuracy=f"{accuracy:.2f}")

if __name__ == '__main__':
    app.run(debug=True)
