from flask import Blueprint, request, jsonify

emergency_bp = Blueprint("emergency", __name__)

@emergency_bp.route("/api/emergency", methods=["GET"])
def get_help_centers():
    # For now, return mock nearby help centers
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    mock_centers = [
        {"name": "Police Station A", "lat": 51.505, "lon": -2.48},
        {"name": "24x7 Women's Helpline", "lat": 51.507, "lon": -2.49},
    ]

    return jsonify(mock_centers)
