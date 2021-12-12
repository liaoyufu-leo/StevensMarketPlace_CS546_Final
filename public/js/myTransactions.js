function myTransactions(event) {
    if (event != "") {
        event.preventDefault();
    }

    $.ajax({
        method: 'GET',
        url: '/transaction/myTransactions',
        contentType: 'application/json',
        success: function (responseMessage) {
            $('main').html(`
                <div class="container">
                    <div class="row">
                        <h1>Transactions</h1><h2></h2><h3></h3>
                    </div>
                    <div class="row">
                        <h4>Sold</h1>
                        <div>Sold Amount:<span id="soldAmount"></span></div>
                    </div>
                    <div id="sold">
                    </div>
                    <div class="row">
                        <h4>Bought</h1>
                        <div>Bought Amount:<span id="boughtAmount"></span></div>
                    </div>
                    <div id="bought">
                    </div>
                </div>
            `);

            if (responseMessage.sold.length == 0) {
                $('#sold').html("<div>You didn't sold anything.</div>");
            } else {
                let sold = 0;
                responseMessage.sold.forEach(element => {
                    sold += parseFloat(element.item.price);
                    $('#sold').html($('#sold').html() + `
                        <div class="row">
                            <div class="col-3">
                                <img src="/images/${element.item.photos[0]}" alt="${element.item.title}" height="100px">
                            </div>
                            <div class="col-3">
                                <h5>Item</h5>
                                <ul>
                                    <li>${element.item.title}</li>
                                    <li>$${element.item.price}</li>
                                    <li>${new Date(element.item.date).toLocaleString('en-US', { timeZone: 'EST' })}</li>
                                <ul>
                            </div>
                            <div class="col-3">
                                <h5>Buyer's details</h5>
                                <ul>
                                    <li><a href="/user/getOne" onclick="getUser(event,'${element.buyer}')">${element.buyer}</a></li>
                                    <li>${element.payment.type}</li>
                                    <li>${new Date(element.date).toLocaleString('en-US', { timeZone: 'EST' })}</li>
                                <ul>
                            </div>
                            ${element.payment.type == "credit card" ?
                            `
                            <div class="col-3">
                                <h5>Buyer's payment details</h5>
                                <ul>
                                    <li>${element.payment.cardNumber}</li>
                                    <li>You can only see the buyer's cardNumber</li>
                                <ul>
                            </div>
                            `:
                            ""}
                            
                            <hr class="my-2">
                        </div>
                    `);
                });
                console.log(sold)
                $('#soldAmount').html(sold);
            }

            if (responseMessage.bought.length == 0) {
                $('#bought').html("<div>You didn't bought anything.</div>");
            } else {
                let bought = 0;
                responseMessage.bought.forEach(element => {
                    bought += parseFloat(element.item.price);
                    $('#bought').html($('#bought').html() + `
                        <div class="row">
                            <div class="col-3">
                                <img src="/images/${element.item.photos[0]}" alt="${element.item.title}" height="100px">
                            </div>
                            <div class="col-3">
                                <h5>Item</h5>
                                <ul>
                                    <li>${element.item.title}</li>
                                    <li>$${element.item.price}</li>
                                    <li><a href="/user/getOne" onclick="getUser(event,'${element.seller}')">${element.seller}</a></li>
                                    <li>${new Date(element.item.date).toLocaleString('en-US', { timeZone: 'EST' })}</li>
                                <ul>
                            </div>
                            <div class="col-3">
                                <h5>Your details</h5>
                                <ul>
                                    <li>${element.buyer}</li>
                                    <li>${element.payment.type}</li>
                                    <li>${new Date(element.date).toLocaleString('en-US', { timeZone: 'EST' })}</li>
                                <ul>
                            </div>
                            ${element.payment.type == "credit card" ?
                            `
                            <div class="col-3">
                                <h5>Your payment details</h5>
                                <ul>
                                    <li>Card Number: ${element.payment.cardNumber}</li>
                                    <li>Valid Date: **/**</li>
                                    <li>CVV: ***</li>
                                <ul>
                            </div>
                            `:
                            ""}
                            
                            <hr class="my-2">
                        </div>
                    `);
                });
                $('#boughtAmount').html(bought);
            }
        },
        error: function (responseMessage) {
            if (responseMessage.status == 400) {
                alert(responseMessage.responseText);
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}