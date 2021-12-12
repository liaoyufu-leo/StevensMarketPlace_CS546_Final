function getItem(event, item_id) {
    if (event != '') {
        event.preventDefault();
    }

    $.ajax({
        method: 'GET',
        url: '/item/getOne/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            let item = responseMessage.item;
            let exist = responseMessage.exist;
            $('main').html(`
                <div id="item_id" hidden>${item._id}</div>
                <div class="row" style="height:30px;"></div>

                <div class="row">
                    <div class="col-5 offset-1 justify-content-center border bg-dark">

                        <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
                            <div id="indicators" class="carousel-indicators">
                            </div>
                            <div id="inner" class="carousel-inner">
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions"
                                data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions"
                                data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="col-4">
                        <div class="col-1"></div>
                        <h1>${item.title}</h1>
                        <hr>
                        <a class="text-dark text-decoration-underline" href="/user/getOne/${item.seller}" onclick="getUser(event,'${item.seller}')">Seller:
                            ${item.seller}</a>
                        <hr>
                        <p class="text-danger font-weight-bold">Prices: ${item.price}</p>
                        <hr>
                        <p>Description:<br>${item.description}</p>
                        <hr>

                        <div class="row">
                            <div id="addOrRemove" class="col-6 d-flex justify-content-center">
                            </div>

                            <div class="col-6 d-flex justify-content-center">
                                <button type="submit" class="btn btn-primary fw-bold" onclick="buyNow(event,'${item._id}')">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="row" style="height:30px;"></div>

                <div class="container mt-5 mb-5">
                    <div class="d-flex justify-content-center row">
                        <div class="d-flex flex-column col-md-12">
                            <div id="comments" class="comment-bottom bg-white p-2 px-4">
                                <div class="add-comment-section mt-4 mb-4">
                                    <textarea id="contentInput" class="form-control mr-3" placeholder="Add comment"></textarea>
                                    <label for="contentInput"></label>
                                    <div class="valid-feedback">
                                       Looks good.
                                    </div>
                                    <div class="invalid-feedback">
                                        Comment must not be empty!
                                    </div>
                                    <div id="commentFormErrorDiv" class="error" style="visibility: hidden;"></div>
                                    <div class="d-flex flex-row justify-content-end">
                                        <label for="commentButton"></label>
                                        <button id="commentButton" class="btn btn-primary" type="button" onclick="comment(event,'${item._id}')">Comment</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>        
            `);
            for (let i = 0; i < item.photos.length; i++) {
                $('#indicators').html($('#indicators').html() + `
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${i}"
                    class="active border" aria-current="true" aria-label="Slide 1"> </button>
                `);
                $('#inner').html($('#inner').html() + `
                <div class="carousel-item  ${i == 0 ? "active" : ""}">
                    <div class="row justify-content-center">
                        <img src="/images/${item.photos[i]}" class="d-block" alt="i" style="height: 20rem; width:auto;">
                        <div style="height: 2rem;"></div>
                    </div>
                </div>
                `);
            }
            if (exist) {
                $('#addOrRemove').html(`
                <button type="submit" class="btn fw-bold text-light" style="background-color:var(--stevensRed)"
                    onclick="removeCart('${item._id}')">
                    Remove Cart
                </button>
                `);
            } else {
                $('#addOrRemove').html(`
                <button type="submit" class="btn fw-bold text-light" style="background-color:var(--stevensRed)"
                    onclick="addCart('${item._id}')">
                    Add Cart
                </button>
                `);
            }
            item.comments.forEach(element => {
                $('#comments').html($('#comments').html() + `
                    <div class="container commented-section mt-2 border border-primary border-1 rounded shadow ">
                        <div class="row commented-user">
                            <p class="col-6 d-flex justify-content-start">${element.commenter}</p>
                            <span class="col-6 d-flex justify-content-end">
                            ${new Date().getDate() == new Date(element.date).getDate() ?
                        new Date(element.date).toLocaleTimeString('en-US') + " Today" :
                        new Date(element.date).toLocaleString('en-US', { timeZone: 'EST' })}
                            </span>
                            <hr>
                        </div>
                        
                        <div class="comment-text-sm">
                            <span>${element.content}</span>
                        </div>
                    </div>
                `)
            });
        },
        error: function (responseMessage) {
            if (responseMessage.status == 404) {
                if (confirm("You have already add this item in your cart! Do you wanna go to cart?")) {
                    window.location.href = "/user/cart";
                } else {
                    window.location.href = "/item/getOne/" + item_id;
                }
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}

function getUser(event, account) {
    event.preventDefault();
    $.ajax({
        method: 'GET',
        url: '/user/getOne/' + account,
        contentType: 'application/json',
        success: function (responseMessage) {
            $('main').html(`
                <div class="container">
                    <h1 class="row d-flex justify-content-center">${responseMessage.account}</h1>
                    <div class="row d-flex justify-content-center">nickname:${responseMessage.nickname}</div>
                    <div class="row d-flex justify-content-center">gender:${responseMessage.gender}</div>
                    <p class="row d-flex justify-content-center">Address</p>
                    <div class="row d-flex justify-content-center">
                        <div class="col-auto">street:${responseMessage.address.street}</div>
                        <div class="col-auto">apt:${responseMessage.address.apt}</div>
                    </div>
                    <div class="row d-flex justify-content-center">
                        <div class="col-auto">city:${responseMessage.address.city}</div>
                        <div class="col-auto">state:${responseMessage.address.state}</div>
                        <div class="col-auto">zipCode:${responseMessage.address.zipCode}</div>
                    </div>
                </div>
            `);
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

function addCart(item_id) {
    $.ajax({
        method: 'GET',
        url: '/user/addCart/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            if (confirm("You add this item in your cart success! Do you wanna go to cart?")) {
                cart("");
            } else {
                getItem("", item_id);
            }
        },
        error: function (responseMessage) {
            if (responseMessage.status == 404) {
                if (confirm("You have already add this item in your cart! Do you wanna go to cart?")) {
                    cart("");
                } else {
                    getItem("", item_id);
                }
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}

function removeCart(item_id) {
    $.ajax({
        method: 'GET',
        url: '/user/removeCart/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            if (confirm("You remove this item in your cart success! Do you wanna go to cart?")) {
                cart("");
            } else {
                getItem("", item_id);
            }
        },
        error: function (responseMessage) {
            if (responseMessage.status == 404) {
                if (confirm("You don't have this item in your cart! Do you wanna go to cart?")) {
                    cart("");
                }
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}

function buyNow(event, item_id) {
    event.preventDefault();
    $('main').html(`
        <div class=" container-fluid my-5 ">
            <div class="row justify-content-center ">
                <div class="col-xl-10">
                    <div class="card shadow-lg ">
                        <div class="row mx-auto justify-content-center text-center">
                            <div class="col-12 mt-3 ">
                                <nav aria-label="breadcrumb" class="second ">
                                    <ol class="breadcrumb indigo lighten-6 first ">
                                        <li class="breadcrumb-item font-weight-bold "><a class="black-text text-uppercase" href="/" style="color:var(--stevensred);">BACK TO SHOP</a></li>
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
                                        <p class="card-text mt-md-4 mb-2 space" style="color:var(--stevensRed);">YOUR ORDER </p>
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
    // return;
    $.ajax({
        method: 'GET',
        url: '/item/getOne/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            let items = [responseMessage.item];
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
                alert(responseMessage.responseText);
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}

function comment(event, item_id) {
    event.preventDefault();

    let inputs = { "content": "" };

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

    inputs["item_id"] = item_id;

    if (flag == true) {
        $.ajax({
            method: 'POST',
            url: '/comment/create',
            contentType: 'application/json',
            data: JSON.stringify(inputs),
            success: function (responseMessage) {
                getItem("", item_id);
            },
            error: function (responseMessage) {
                if (responseMessage.status == 400) {
                    errors(responseMessage.responseJSON.errors, "comment");
                } else if (responseMessage.status == 500) {
                    alert(responseMessage.responseText);
                } else {
                    alert(responseMessage.responseText);
                }

            }
        });
    }

}