from flask import request, jsonify, render_template
from . import app, db
from .models import Hammer, TransactionLog


# default endpoint
@app.route("/")
def home():
    return render_template("index.html")


# function to populate dummy data
def populate_dummy_data():
    dummy_hammers = [
        {"type": "Dummy Hammer 1", "price": 10.0, "quantity": 20},
        {"type": "Dummy Hammer 2", "price": 15.0, "quantity": 15},
        {"type": "Dummy Hammer 3", "price": 20.0, "quantity": 25},
    ]

    for data in dummy_hammers:
        hammer = Hammer(
            type=data["type"], price=data["price"], quantity=data["quantity"]
        )
        db.session.add(hammer)

    db.session.commit()


@app.route("/populate_dummy_data", methods=["POST"])
def populate_dummy_data_route():
    populate_dummy_data()
    return jsonify({"message": "Dummy data populated successfully"}), 200


@app.route("/hammers", methods=["POST"])
def add_hammer():
    data = request.get_json()
    hammer = Hammer(type=data["type"], price=data["price"], quantity=data["quantity"])
    db.session.add(hammer)
    db.session.commit()
    return jsonify(hammer_id=hammer.id), 201


@app.route("/hammers/<int:id>/sell", methods=["POST"])
def sell_hammer(id):
    hammer = Hammer.query.get_or_404(id)

    if hammer.quantity > 0:
        hammer.quantity -= 1
        hammer.sold += 1  # Increment the sold count
        hammer.buyback_price = 0.0

        db.session.commit()

        # Log the transaction
        transaction_log = TransactionLog(
            amount=hammer.price,
            name=hammer.type,
            transaction_type="sell",
            hammer_id=hammer.id,
        )
        db.session.add(transaction_log)
        db.session.commit()

        # Return the updated hammer object along with success message
        return jsonify({"success": True, "hammer": hammer.serialize()}), 200
    else:
        return jsonify({"error": "Hammer quantity is zero, cannot be sold"}), 400


@app.route("/hammers/<int:id>/buy", methods=["POST"])
def buy_it_back(id):
    hammer = Hammer.query.get_or_404(id)
    if hammer.sold > 0:
        hammer.sold -= 1  # Mark as not sold
        hammer.quantity += 1
        buyback_price = 0.75 * hammer.price
        hammer.buyback_price = buyback_price

        db.session.commit()

        # Log the transaction
        transaction_log = TransactionLog(
            amount=hammer.buyback_price,
            name=hammer.type,
            transaction_type="buy",
            hammer_id=hammer.id,
        )
        db.session.add(transaction_log)
        db.session.commit()

        return jsonify({"success": True, "hammer": hammer.serialize()}), 200
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
            "quantity": hammer.quantity,
        }
        for hammer in hammers
    ]
    return jsonify(hammers=hammer_list)


@app.route("/hammers/<int:id>/delete", methods=["DELETE"])
def delete_hammer(id):

    hammer = Hammer.query.get_or_404(id)

    if hammer:
        db.session.delete(hammer)
        db.session.commit()
        return jsonify({"message": f"product with ID {id} deleted successfully"}), 200
    else:
        return jsonify({"message", f"Product with ID {id} was not deleted"}), 404


@app.route("/transaction_log", methods=["GET"])
def transaction_log():
    # Retrieve all transaction log entries from the database
    transaction_logs = TransactionLog.query.all()

    # Serialize transaction log entries
    transaction_log_data = [
        {
            "id": log.id,
            "name": log.name,
            "amount": log.amount,
            "transaction_type": log.transaction_type,
            "hammer_id": log.hammer_id,
        }
        for log in transaction_logs
    ]

    # Return the serialized transaction log data as JSON
    return jsonify(transaction_log=transaction_log_data)


@app.errorhandler(500)
def handle_500(error):
    return jsonify({"error": "Internal server error"}), 500
