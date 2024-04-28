# tests/test_app.py

import pytest
from app import app  # Assuming your Flask app instance is named 'app'


@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    with app.test_client() as client:
        yield client


def test_index(client):
    """Test the index route."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Hello, World!' in response.data  # Adjust this assertion based on your actual index route response
