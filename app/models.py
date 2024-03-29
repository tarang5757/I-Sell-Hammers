from app import db


# define the model
class Hammer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    sold = db.Column(db.Integer, default=0)


def __init__(self, type, price, sold):
    self.type = type
    self.price = price
    self.sold = sold
