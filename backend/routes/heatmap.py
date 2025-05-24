from flask import Blueprint, send_file
import os

heatmap_bp = Blueprint("heatmap", __name__)

@heatmap_bp.route("/api/heatmap", methods=["GET"])
def get_heatmap():
    file_path = os.path.join("static", "dark_zones.geojson")
    return send_file(file_path, mimetype="application/json")
