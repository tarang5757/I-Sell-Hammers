// Utility Functions
function sellHammer(id) {
    fetch('/hammers/' + id + '/sell', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            loadHammers();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function buyHammer(id) {
    fetch('/hammers/' + id + '/buy', { method: "POST" })
        .then(response => response.json())
        .then(data => {
            console.log("Buyback Success: ", data);
            loadHammers();


        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Utility Functions
function list_buybacks(hammerId) {
    fetch('/buybacks')
        .then(response => response.json())
        .then(data => {
            const buybacks = data.buybacks;
            const filteredBuybacks = buybacks.filter(buyback => buyback.hammer_id === hammerId);
            // Assuming you have a way to display these filtered buybacks. For simplicity, logging them:
            console.log('Buybacks for hammer ' + hammerId + ':', filteredBuybacks);
            // Here you could update the UI to display these buybacks, perhaps in a modal or a dedicated section next to the hammer.
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}



function calculateTotalSales(hammers, buybacks) {
    let totalSales = 0;

    // Add to total sales for each hammer that has ever been sold
    hammers.forEach(hammer => {
        // Assume that the hammer was ever sold if it's not currently sold but there is a buyback record
        const wasEverSold = hammer.sold || buybacks.some(buyback => buyback.hammer_id === hammer.id);
        if (wasEverSold) {
            totalSales += parseFloat(hammer.price);
        }
    });

    // Deduct from total sales for each unique buyback
    let processedBuybacks = new Set();
    buybacks.forEach(buyback => {
        if (!processedBuybacks.has(buyback.hammer_id)) {
            totalSales -= parseFloat(buyback.buyback_price);
            processedBuybacks.add(buyback.hammer_id);
        }
    });

    return totalSales;
}

function loadHammers() {
    Promise.all([
        fetch('/hammers').then(response => response.json()),
        fetch('/buybacks').then(response => response.json())
    ]).then(([hammersData, buybacksData]) => {
        const hammers = hammersData.hammers;
        const buybacks = buybacksData.buybacks;
        const tableBody = document.getElementById('hammersTable').getElementsByTagName('tbody')[0];

        // Clear the table before repopulating it
        tableBody.innerHTML = '';

        // Update wasSold status based on buybacks
        hammers.forEach(hammer => {
            hammer.wasSold = hammer.sold || buybacks.some(buyback => buyback.hammer_id === hammer.id);
        });

        // Populate the table with hammers
        hammers.forEach(hammer => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = hammer.id;
            row.insertCell(1).innerText = hammer.type;
            row.insertCell(2).innerText = hammer.price;
            row.insertCell(3).innerText = hammer.sold ? 'Yes' : 'No';

            const actionCell = row.insertCell(4);
            const sellButton = document.createElement('button');
            sellButton.innerText = 'Sell';
            sellButton.className = 'btn btn-success';
            sellButton.onclick = () => sellHammer(hammer.id);
            sellButton.disabled = hammer.sold;
            actionCell.appendChild(sellButton);

            const buybackButton = document.createElement('button');
            buybackButton.innerText = 'Buy It Back';
            buybackButton.className = 'btn btn-primary';
            buybackButton.onclick = () => buyHammer(hammer.id);
            buybackButton.disabled = !hammer.sold;
            actionCell.appendChild(buybackButton);
        });

        // Calculate and display total sales
        const totalSales = calculateTotalSales(hammers, buybacks);
        document.getElementById('totalSales').innerText = `${totalSales.toFixed(2)}`;

    }).catch((error) => {
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

        fetch('/hammers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: hammerType, price: hammerPrice }),
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

    loadHammers();
}

// Execute the initialization function when the window is fully loaded
// This ensures that the DOM is fully loaded before attaching event listeners and executing initial functions.
window.onload = initApplication;