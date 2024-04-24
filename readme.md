# I Sell Hammer Flask App
Welcome to the I Sell Hammer Flask application. This application allows you to manage hammer sales and transactions through a set of endpoints.

## Description

The application provides HTTP endpoints for performing various operations on hammers, including adding, selling, refunding, and deleting hammers, as well as retrieving transaction logs.

## Getting Started

To use the application, follow these steps:

1. Set up the Flask environment and ensure Python and pip are installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the project directory.
4. Install dependencies using `pip install -r requirements.txt`.
5. Configure the Flask application settings in the `config.py` file.
6. Run the Flask application by executing `python main.py`.
7. Once the application is running, you can access the webpage at `http://127.0.0.1:5000/`
## Endpoints

- `/`: Renders the home page.
- `/populate_dummy_data`: Populates the database with dummy data.
- `/hammers`: 
  - `GET`: Lists all available hammers.
  - `POST`: Adds a new hammer to the database.
- `/hammers/<int:id>/sell`: Sells a specific hammer.
- `/hammers/<int:id>/buy`: Buys back a previously sold hammer.
- `/hammers/<int:id>/delete`: Deletes a hammer from the database.
- `/transaction_log`: Retrieves the transaction logs.

## Usage Example
Suppose you want to sell a hammer with ID `123`. You would send a POST request to `/hammers/123/sell`.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
