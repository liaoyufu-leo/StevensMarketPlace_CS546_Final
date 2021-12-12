function cart(event) {
    if (event != '') {
        event.preventDefault();
    }
    $.ajax({
        method: 'GET',
        url: '/user/cart',
        contentType: 'application/json',
        success: function (responseMessage) {
            $('main').html(`
            <div class=" container-fluid my-5 ">
                <div class="row justify-content-center ">
                    <div class="col-xl-10">
                        <div class="card shadow-lg ">
                            <div class="row mx-auto justify-content-center text-center">
                                <div class="col-12 mt-3 ">
                                    <nav aria-label="breadcrumb" class="second ">
                                        <ol class="breadcrumb indigo lighten-6 first ">
                                            <li class="breadcrumb-item font-weight-bold "><a class="black-text text-uppercase" href="/"><span class="mr-md-3 mr-1" style="color:var(--stevensRed);">BACK TO SHOP</span></a></li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div class="row justify-content-around">
                                <div class="col-md-5">
                                    <div class="card border-0">
                                        <div class="card-body">
                                            <div class="row">
                                                <form id="paymentForm" class="needs-validation" novalidate>
                                                    <h1>Duck Payment</h1>
                                                    <span>Please input fake payment!</span>                                   
                                                    <div class="form-floating mb-2">
                                                    <input type="text" class="form-control" id="cardNumberInput" value="1234123412341234" placeholder="xxxxx xxxx xxxx xxxx">
                                                    <label for="cardNumberInput">Card Number</label>
                                                    <div class="valid-feedback">
                                                        Looks good!
                                                    </div>
                                                    <div class="invalid-feedback">
                                                        Card number must be have 16 numbers!
                                                    </div>
                                                    </div>
                                        
                                                    <div class="form-floating mb-2">
                                                    <input type="text" class="form-control" id="validDateInput" value="01/29" placeholder="01/29">
                                                    <label for="validDateInput">Valid Date</label>
                                                    <div class="valid-feedback">
                                                        Looks good!
                                                    </div>
                                                    <div class="invalid-feedback">
                                                        Valid Date must be mm/yy and must be after today!
                                                    </div>
                                                    </div>

                                                    <div class="form-floating mb-2">
                                                    <input type="text" class="form-control" id="securityCodeInput" value="666" placeholder="666">
                                                    <label for="securityCodeInput">Security Code</label>
                                                    <div class="valid-feedback">
                                                        Looks good!
                                                    </div>
                                                    <div class="invalid-feedback">
                                                        Security code must be three numbers!
                                                    </div>
                                                    </div>
                                        
                                                    <div class="row d-flex justify-content-center">
                                                    <div class="col-6 d-flex justify-content-center">
                                                        <button class="btn btn-primary" type="submit" onclick="checkout(event)">
                                                            Checkout
                                                        </button>
                                                    </div>
                                                    </div>
                                        
                                                    <div id="paymentFormErrorDiv" class="error" style="visibility: hidden;"></div>
                                        
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <div class="card border-0 ">
                                        <div class="card-header card-2">
                                            <p class="card-text mt-md-4 mb-2 space" style="color:var(--stevensRed);">YOUR ORDER</p>
                                            <hr class="my-2">
                                        </div>
                                        <div class="card-body pt-0">
                                            <div id="items">
                                            </div>
                                            <div class="row ">
                                                <div class="col">                                                     
                                                    <div class="row justify-content-between">
                                                        <div class="col-4">
                                                            <p><b>Total</b></p>
                                                        </div>
                                                        <div class="flex-sm-col col-auto">
                                                            <p class="mb-1 fw-bold">$<span id="total"></span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
            let items = responseMessage.items;
            let total = 0;
            items.forEach(element => {
                total += element.price;
                $('#items').html($('#items').html() + `
                    <div class="row">
                        <div class="col-2 d-flex justify-content-center">
                            <input value="${element.price + "/" + element._id}" class="cartItems form-check-input me-1 align-self-center" type="checkbox"  aria-label="...">
                        </div>
                        <div class="col-2"><img src="/images/${element.photos[0]}" alt="${element.title}" width="50px"></div>
                        <div class="col-3 d-flex justify-content-center"><span class="align-self-center fw-bold">${element.title}</span></div>
                        <div class="col-3 d-flex justify-content-center">
                            <a class="align-self-center" onclick="directRemove(event,'${element._id}')" title="remove this item from your cart">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </a>
                        </div>
                        <div class="col-2 d-flex justify-content-end"><span class="align-self-center fw-bold">$${element.price}</span></div>
                        <hr class="my-2">
                    </div>
                `);
            });
            $('#total').text(total);

            $('.cartItems').each(element => {
                let checkbox = $($('.cartItems')["" + element]);
                checkbox.prop("checked", true);
                checkbox.change(function () {
                    // console.log(checkbox)
                    if (checkbox.prop("checked")) {
                        $('#total').text(parseFloat($('#total').text()) + parseFloat(checkbox.val().slice('0', checkbox.val().lastIndexOf('/'))));
                    } else {
                        $('#total').text(parseFloat($('#total').text()) - parseFloat(checkbox.val().slice('0', checkbox.val().lastIndexOf('/'))));
                    }
                });
            });

        },
        error: function (responseMessage) {
            if (responseMessage.status == 400) {
                errors(responseMessage.responseJSON.errors, "login");
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}

function directRemove(event, item_id) {
    event.preventDefault();
    $.ajax({
        method: 'GET',
        url: '/user/removeCart/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            cart("");

        },
        error: function (responseMessage) {
            if (responseMessage.status == 404) {
                alert("You don't have this item in your cart! Do you wanna go to cart?")
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}

function checkout(event) {
    event.preventDefault();

    if ($('.cartItems').length == 0) {
        alert("You don't have anything in your cart, please add something to checkout!");
        return;
    }

    var inputs = { "cardNumber": "", "validDate": "", "securityCode": "" };

    var flag = true;

    for (var key in inputs) {
        var input = $('#' + key + 'Input');
        if (!(inputs[key] = check(input.val(), key))) {
            flag = false;
            input.removeClass("is-valid");
            input.addClass("is-invalid");
        } else {
            input.removeClass("is-invalid");
            input.addClass("is-valid");
        }
    }

    let num = 0;
    $('.cartItems').each(element => {
        let checkbox = $($('.cartItems')["" + element]);
        if (checkbox.prop("checked")) {
            num++;
        }
    });
    if (num == 0) {
        flag = false;
        alert("You don't select anything, please select the items first!");
    }

    if (flag == true) {
        let item_ids = [];
        inputs["type"] = "credit card";
        $('.cartItems').each(element => {
            let checkbox = $($('.cartItems')["" + element]);
            let item_id = checkbox.val().slice(checkbox.val().lastIndexOf('/') + 1, checkbox.val().length);

            if (checkbox.prop("checked")) {
                item_ids.push(item_id);
            }

        });

        $.ajax({
            method: 'POST',
            url: '/transaction/create',
            contentType: 'application/json',
            data: JSON.stringify({ "item_ids": item_ids, "payment": inputs }),
            success: function (responseMessage) {
                myTransactions("");
            },
            error: function (responseMessage) {
                if (responseMessage.status == 400) {
                    errors(responseMessage.responseJSON.errors, "payment");
                } else if (responseMessage.status == 500) {
                    alert(responseMessage.responseText);
                } else {
                    alert(responseMessage.responseText);
                }

            }
        });
    }
}
