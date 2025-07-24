import json

from flask import Flask, request, jsonify
from web_audit import Web_audit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from React

@app.route('/api/audit', methods=['POST'])
def audit_url():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL is required"}), 400

    audit = Web_audit()
    result = audit.check_url(url)
    with open("web_audit_result.json", "r", encoding="utf-8") as f:
        json_data = json.load(f)

    return jsonify(json_data)




if __name__ == "__main__":
    app.run(debug=True)
