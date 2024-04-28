from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///hammers.db"
# secret key
app.config["SECRET KEY"] = "tarang"

# initialize database
db = SQLAlchemy(app)


from .routes import *  # Import routes from routes.py
