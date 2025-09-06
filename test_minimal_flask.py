#!/usr/bin/env python3
"""
Minimal Flask test app to isolate the issue.
"""

from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, Flask is working!"

@app.route("/api/test")
def test():
    return jsonify({"message": "API endpoint working", "status": "success"})

if __name__ == "__main__":
    print("Starting minimal Flask test app...")
    app.run(host="0.0.0.0", port=5000, debug=False)

