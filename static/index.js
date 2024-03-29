document.addEventListener("DOMContentLoaded", function () {
    // Add event listener for the form submission event
    document.getElementById('addHammerForm').addEventListener('submit', function (e) {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Get the value of the hammer type input
        var hammerType = document.getElementById('hammerType').value;
        // Get the value of the hammer price input
        var hammerPrice = document.getElementById('hammerPrice').value;

        // Using the fetch api to send a post request to add a new hammer
        fetch('/hammers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Convert the form values to a JSON string
            body: JSON.stringify({ type: hammerType, price: hammerPrice }),
        })
            // Parse the JSON response
            .then(response => response.json())
            // Handle the response data
            .then(data => {
                console.log('Success:', data);
                // Refresh the hammers list
                loadHammers();
                // Reset the form inputs
                document.getElementById('addHammerForm').reset();
            })
            // Catch and log any errors
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    // function to mark a hammer as sold
    function sellHammer(id) {
        // Send a post request to the sell hammer endpoint
        fetch('/hammers/' + id + '/sell', {
            method: 'POST'
        })
            // parse the JSON response
            .then(response => response.json())
            // handle the response
            .then(data => {
                console.log('Success:', data);
                // refresh the hammers list
                loadHammers();
            })
            // Catch and log any errors
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // function to load hammers from the database and update the display
    function loadHammers() {
        // Send a GET request to retrieve the list of hammers
        fetch('/hammers')
            // Parse the JSON response
            .then(response => response.json())
            // Handle the hammers data
            .then(data => {
                var hammers = data.hammers;
                // Get the table body element where the hammers will be listed
                var tableBody = document.getElementById('hammersTable').getElementsByTagName('tbody')[0];
                // Clear the current list of hammers
                tableBody.innerHTML = '';
                // Initialize total sales counter
                var totalSales = 0;

                // loop over each hammer and create a table row for each one
                hammers.forEach(function (hammer) {
                    var row = tableBody.insertRow();
                    // insert cells for hammer id, type, price, and sold status
                    row.insertCell(0).innerText = hammer.id;
                    row.insertCell(1).innerText = hammer.type;
                    row.insertCell(2).innerText = hammer.price;
                    row.insertCell(3).innerText = hammer.sold ? 'Yes' : 'No';

                    // create a sell button for each hammer
                    var sellButton = document.createElement('button');
                    sellButton.innerText = 'Sell';
                    sellButton.className = 'btn btn-success';
                    // attach an event listener to the sell button
                    sellButton.onclick = function () { sellHammer(hammer.id); };
                    // Disable the button if the hammer is already sold
                    sellButton.disabled = hammer.sold;

                    // Append the sell button to the last cell
                    var actionCell = row.insertCell(4);
                    actionCell.appendChild(sellButton);

                    // Add to total sales if the hammer is sold
                    if (hammer.sold) {
                        totalSales += parseFloat(hammer.price);
                    }
                });

                // update the total sales display with the new total
                document.getElementById('totalSales').innerText = totalSales.toFixed(2);
            })
            // catch and log any errors
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // initial call to load hammers and display them
    loadHammers();
});
