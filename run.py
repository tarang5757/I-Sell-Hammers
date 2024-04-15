from app import app, db

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Creates tables based on models.py definitions
    app.run(debug=True)
