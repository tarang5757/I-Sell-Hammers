let totalSales = 0; // Define totalSales globally to maintain its value across multiple function calls

// Utility Functions
function sellHammer(id) {
    fetch('/hammers/' + id + '/sell', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log('Success: lol', data);
            loadHammers();
            totalSales += calculateTotalSales(data.hammer, 'sell'); // Update totalSales globally
            document.getElementById('totalSales').innerText = `${totalSales.toFixed(2)}`;
        })

        .catch((error) => {
            console.error('Error:', error);
        });
}

function buyHammer(id) {
    fetch('/hammers/' + id + '/buy', { method: "POST" })
        .then(response => response.json())
        .then(data => {
            console.log("Buyback Success: ", data.hammer);
            loadHammers();
            totalSales += calculateTotalSales(data.hammer, 'buy'); // Update totalSales globally
            document.getElementById('totalSales').innerText = `${totalSales.toFixed(2)}`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Utility Functions
function calculateTotalSales(hammer, action) {

    // Calculate total sales based on the hammer and action
    console.log("here is hammer in buy", hammer)
    let sales = 0;

    if (action === 'sell') {
        sales += parseFloat(hammer.price);
    } else if (action === 'buy') {
        console.log("here is buyback price", hammer.buyback_price)
        sales -= parseFloat(hammer.buyback_price);
    }

    return sales;
}


function displayTransactionLog() {
    fetch('/transaction_log')
        .then(response => response.json())
        .then(data => {
            let transactionLogHTML = "<ul>";
            data.transaction_log.forEach(transaction => {
                if (transaction.transaction_type == "sell") {
                    transactionLogHTML += `<li> Hammer ${transaction.name} was sold for $${transaction.amount}</li>`;
                } else if (transaction.transaction_type == "buy") {
                    transactionLogHTML += `<li> Hammer ${transaction.name} was refunded at a price of $${transaction.amount}</li>`;
                }
            });
            transactionLogHTML += "</ul>";

            //Set the transaction log content to the modal
            document.getElementById('transactionLogModalContent').innerHTML = transactionLogHTML;

            //Show the modal
            $('#transactionLogModal').modal('show');
        })
        .catch(error => {
            console.log("error:", error);
        });
}










function loadHammers() {
    Promise.all([
        fetch('/hammers').then(response => response.json()),
    ]).then(([hammersData]) => {
        const hammers = hammersData.hammers;
        const tableBody = document.getElementById('hammersTable').getElementsByTagName('tbody')[0];

        // Clear the table before repopulating it
        tableBody.innerHTML = '';

        // Populate the table with hammers
        hammers.forEach(hammer => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = hammer.id;
            row.insertCell(1).innerText = hammer.type;
            row.insertCell(2).innerText = hammer.quantity;
            row.insertCell(3).innerText = hammer.price;
            row.insertCell(4).innerText = hammer.sold;



            const actionCell = row.insertCell(5);
            const sellButton = document.createElement('button');
            sellButton.innerText = 'Sell';
            sellButton.className = 'btn btn-success';
            sellButton.onclick = () => sellHammer(hammer.id);
            sellButton.disabled = hammer.quantity === 0;
            actionCell.appendChild(sellButton);

            const buybackButton = document.createElement('button');
            buybackButton.innerText = 'Buy It Back';
            buybackButton.className = 'btn btn-primary';
            buybackButton.onclick = () => buyHammer(hammer.id);
            buybackButton.disabled = hammer.sold === 0
            actionCell.appendChild(buybackButton);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = "delete"
            deleteButton.className = 'btn btn-warning'
            deleteButton.onclick = () => deleteHammer(hammer.id);
            actionCell.appendChild(deleteButton);




        });

    }).catch((error) => {
        console.error('Error:', error);
    });
}


function deleteHammer(id) {
    fetch('/hammers/' + id + "/delete", { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                console.log('Success: Product deleted successfully');
                loadHammers();
            } else {
                console.error('Failed to delete product');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}





// Initializes form submission event and loads hammers
function initApplication() {
    // Setup form submission handler
    document.getElementById('addHammerForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const hammerType = document.getElementById('hammerType').value;
        const hammerPrice = document.getElementById('hammerPrice').value;
        const hammerQuantity = document.getElementById('hammerQuantity').value;

        fetch('/hammers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: hammerType, price: hammerPrice, quantity: hammerQuantity }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                loadHammers();
                document.getElementById('addHammerForm').reset();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    populateDummyData();


    //call displayTransactionLog function
    document.getElementById('viewLogsButton').addEventListener('click', displayTransactionLog);
    loadHammers();

}

function populateDummyData() {
    fetch('/populate_dummy_data', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log('Dummy data populated successfully');
        })
        .catch(error => {
            console.error('Error populating dummy data:', error);
        });
}

// Execute the initialization function when the window is fully loaded
// This ensures that the DOM is fully loaded before attaching event listeners and executing initial functions.
window.onload = initApplication;
