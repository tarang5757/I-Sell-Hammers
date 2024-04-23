from app import db


class Hammer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float, nullable=False)
    sold = db.Column(db.Integer, default=0)
    buyback_price = db.Column(db.Float, default=0.0)

    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "quantity": self.quantity,
            "price": self.price,
            "sold": self.sold,
            "buyback_price": self.buyback_price,
        }


class TransactionLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(16), default="undefined")
    amount = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(3), nullable=False)
    hammer_id = db.Column(db.Integer, db.ForeignKey("hammer.id"))
    hammer = db.relationship("Hammer", backref=db.backref("transactions", lazy=True))

    # Create a string representation
    def __repr__(self):
        return "<TransactionLog {}>".format(self.id)
