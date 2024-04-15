from app import db


class Hammer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    sold = db.Column(db.Integer, default=0)


class Buyback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hammer_id = db.Column(db.Integer, db.ForeignKey("hammer.id"), nullable=False)
    buyback_price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())


# create a string
def __repr__(self):
    return "<Buyback {}>".format(self.id)
