from flask import Flask, request, jsonify, render_template
import sqlite3

def create_table():
    # establishe connection to sqlite database
    connection = sqlite3.connect('hammers.db')
    cursor = connection.cursor()
    # sqls statements to create the table if it doesn't exist.
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hammers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        price REAL NOT NULL,
        sold INTEGER NOT NULL DEFAULT 0
    );
    """)
    connection.commit()
    connection.close()




# establishes connection to the database.
def getDbConnection():
    connection = sqlite3.connect('hammers.db')
    connection.row_factory = sqlite3.Row
    return connection

app = Flask(__name__)

@app.route("/hammers", methods=['POST'])
def add_hammer():
    data = request.get_json()
    connection = getDbConnection()
    cursor = connection.cursor()
    cursor.execute('INSERT INTO hammers (type, price, sold) VALUES (?, ?, ?)',
                   (data['type'], data['price'], 0))
    connection.commit()
    hammer_id = cursor.lastrowid
    connection.close()
    return jsonify(hammer_id=hammer_id), 201

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/hammers/<int:id>/sell', methods=['POST'])
def sell_hammer(id):
    # Fixed: Added missing parentheses to call getDbConnection
    connection = getDbConnection()
    cursor = connection.cursor()
    # Fixed: Corrected the execute method's parameters for the UPDATE statement.
    cursor.execute('UPDATE hammers SET sold = 1 WHERE id=?', (id,))
    connection.commit()
    connection.close()
    return jsonify({'success': True}), 200

@app.route('/hammers', methods=['GET'])
def list_hammers():
    connection = getDbConnection()
    cursor = connection.cursor()
    hammers = cursor.execute("SELECT * FROM hammers").fetchall()
    connection.close()
    # Corrected variable name from 'hammer' to 'hammers' in list comprehension.
    hammer_list = [{'id': hammer['id'], 'type': hammer['type'], 'price': hammer['price'], 'sold': hammer['sold']} for hammer in hammers]
    return jsonify(hammers=hammer_list)

if __name__ == '__main__':
    # Ensures the table is created before running the app.
    create_table()
    app.run(debug=True)
