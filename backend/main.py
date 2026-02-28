from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=["POST"])
def api():
    body = request.get_json(silent=True) or {}
    pokemon = body.get("pokemon", "").strip().lower()

    if not pokemon:
        return jsonify({"error": "Pokemon name is required"}), 400

    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon}"

    try:
        response = requests.get(url, timeout=10)
    except requests.RequestException:
        return jsonify({"error": "Failed to retrieve Pokemon data"}), 502

    if response.status_code != 200:
        return jsonify({"error": "Pokemon not found"}), 404

    payload = response.json()
    result = {
        "name": payload["name"],
        "id": payload["id"],
        "sprite": payload["sprites"]["front_default"],
        "types": [entry["type"]["name"] for entry in payload["types"]],
        "stats": [
            {"name": entry["stat"]["name"], "base_stat": entry["base_stat"]}
            for entry in payload["stats"]
        ],
    }

    return jsonify(result), 200

if __name__ == "__main__":
    app.run(debug=True)
