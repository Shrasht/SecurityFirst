from flask import Blueprint, request, jsonify
from utils.route_score import mock_route_score

analyze_route_bp = Blueprint("analyze_route", __name__)

@analyze_route_bp.route("/api/score-route", methods=["POST"])
def score_route():
    data = request.get_json()
    coordinates = data.get("route", [])
    score = mock_route_score(coordinates)
    return jsonify({"safety_score": score})
