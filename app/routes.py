from flask import request, jsonify, render_template
from app import app, db
from app.models import Hammer
from app.utils import get_db_connection


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/hammers", methods=["POST"])
def add_hammer():
    data = request.get_json()
    print(data)
    hammer = Hammer(type=data["type"], price=data["price"])
    db.session.add(hammer)
    db.session.commit()
    return jsonify(hammer_id=hammer_id), 201


@app.route("/hammers/<int:id>/sell", methods=["POST"])
def sell_hammer(id):
    hammer = Hammer.query.get_or_401(id)
    hammer.sold = 1
    db.session.commit()
    return jsonify({"success": True}), 200


@app.route("/hammers", methods=["GET"])
def list_hammers():
    hammers = Hammer.query.all()
    hammer_list = [
        {
            "id": hammer.id,
            "type": hammer.type,
            "price": hammer.price,
            "Sold": hammer.sold,
        }
        for hammer in hammers
    ]
    return jsonify(hammers=hammer_list)
