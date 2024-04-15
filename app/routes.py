from flask import request, jsonify, render_template
from . import app, db
from .models import Hammer, Buyback


# default endpoint
@app.route("/")
def home():
    return render_template("index.html")  # Assuming you have an index.html template


@app.route("/hammers", methods=["POST"])
def add_hammer():
    data = request.get_json()
    hammer = Hammer(type=data["type"], price=data["price"])
    db.session.add(hammer)
    db.session.commit()
    return jsonify(hammer_id=hammer.id), 201


@app.route("/hammers/<int:id>/sell", methods=["POST"])
def sell_hammer(id):
    hammer = Hammer.query.get_or_404(id)
    hammer.sold = 1  # mark the hammer as sold

    # Check if there's an existing buyback entry for this hammer
    buyback_entry = Buyback.query.filter_by(hammer_id=id).first()
    if buyback_entry:
        # If an entry exists, delete it from the database
        db.session.delete(buyback_entry)

    db.session.commit()  # Commit changes to the database
    return jsonify({"success": True}), 200


# This methods will buyback the hammer at 0.75x the initial cost
@app.route("/hammers/<int:id>/buy", methods=["POST"])
def buy_it_back(id):
    hammer = Hammer.query.get_or_404(id)
    if hammer.sold:
        buyback_price = 0.75 * hammer.price
        hammer.sold = 0  # Mark as not sold

        # record buy buy back transactions
        buyback = Buyback(hammer_id=hammer.id, buyback_price=buyback_price)
        db.session.add(buyback)
        db.session.commit()
        return jsonify({"success": True, "buyback_price": buyback_price}), 200
    else:
        return jsonify({"error": "Hammer not sold, cannot buy back"}), 400


# this methods will list all the hammers from the database
@app.route("/hammers", methods=["GET"])
def list_hammers():
    hammers = Hammer.query.all()
    hammer_list = [
        {
            "id": hammer.id,
            "type": hammer.type,
            "price": hammer.price,
            "sold": hammer.sold,
        }
        for hammer in hammers
    ]
    return jsonify(hammers=hammer_list)


# this will list all tha buybacks from the database
@app.route("/buybacks", methods=["GET"])
def list_buybacks():
    buybacks = Buyback.query.all()
    buyback_list = [
        {
            "id": buyback.id,
            "hammer_id": buyback.hammer_id,
            "buyback_price": buyback.buyback_price,
            "timestamp": buyback.timestamp,
        }
        for buyback in buybacks
    ]
    return jsonify(buybacks=buyback_list)


@app.route("/hammers/<int:id>/delete", methods=["DELETE"])
def delete_hammer(id):

    hammer = Hammer.query.get_or_404(id)

    if hammer:
        buyback_entry = Buyback.query.filter_by(hammer_id=id).first()
        if buyback_entry:
            db.session.delete(buyback_entry)

        db.session.delete(hammer)
        db.session.commit()
        return jsonify({"message": f"product with ID {id} deleted successfully"}), 200
    else:
        return jsonify({"message", f"Product with ID {id} was not deleted"}), 404


@app.errorhandler(500)
def handle_500(error):
    return jsonify({"error": "Internal server error"}), 500
