search();

(function ($) {

    $('#searchForm').submit(function (event) {
        event.preventDefault();
        search();
    });

})(jQuery);

function search() {

    let keyword = $('#searchInput').val();
    $('#content').html("");
    $.ajax({
        method: 'GET',
        url: '/item/search/?keyword=' + keyword,
        contentType: 'application/json',
        success: function (responseMessage) {
            $('main').html(`
          <div class="container-fluid bg-trasparent my-4 p-3" style="position: relative;">
              <div id="content" class="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-4 g-3">
              </div>
          </div>
        `);
            responseMessage.items.forEach(element => {
                $('#content').html($('#content').html() + `
            <div class="col">
              <div class="card h-100 shadow-sm"> <img src="/images/${element.photos[0]}" class="card-img-top" alt="...">
                  <div class="card-body">
                      <div class="clearfix mb-3"> 
                        <span class="float-start badge rounded-pill bg-primary">${element.title}</span> 
                        <span class="float-end price-hp" style="color:red">$${element.price}</span> 
                      </div>
                      <h5 class="card-title">${element.description}</h5>
                      <div class="text-center my-4"> <a href="/item/getOne/${element._id}" onClick=getItem(event,'${element._id}') class="btn btn-warning">Check Item</a> </div>
                  </div>
              </div>
            </div>
            `);
            });
        },
        error: function (responseMessage) {
            alert(responseMessage.responseText);
        }
    });
}

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
                    <div class="col-4 offset-1 justify-content-center border" style="background-color:lightsteelblue;">

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
                    <div class="col-1"></div>
                    <div class="col-4">
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
                                    <div class="valid-feedback">
                                       Looks good.
                                    </div>
                                    <div class="invalid-feedback">
                                        Comment must not be empty!
                                    </div>
                                    <div id="commentFormErrorDiv" class="error" style="visibility: hidden;"></div>
                                    <div class="d-flex flex-row justify-content-end">
                                        <img class="img-fluid img-responsive rounded-circle mr-2" src="/images/avatar.png" width="38">
                                        <button class="btn btn-primary" type="button" onclick="comment(event,'${item._id}')">Comment</button>
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
                                        <li class="breadcrumb-item font-weight-bold "><a class="black-text text-uppercase" href="/"><span class="mr-md-3 mr-1">BACK TO SHOP</span></a><i class="fa fa-angle-double-right " aria-hidden="true"></i></li>
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
                                        <p class="card-text text-muted mt-md-4 mb-2 space">YOUR ORDER <span class=" small text-muted ml-2 cursor-pointer">EDIT SHOPPING BAG</span> </p>
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

function newItem(event) {
    event.preventDefault();
    $('main').html(`
        <div class="row">
            <div class="col-md-12">
                <div class="container-fluid col-md-6 mt-3">
                    <form id="newItemForm" class="needs-validation" novalidate>

                    <h1 class="row d-flex justify-content-center mb-3">Create New Item</h1>

                    <div class="form-floating mb-2">
                        <input type="text" name="title" class="form-control" id="titleInput" placeholder="xxxx">
                        <label for="titleInput">title</label>
                        <div class="valid-feedback">
                        Looks good!
                        </div>
                        <div class="invalid-feedback">
                        Title must not be null and not longer than 100 letters!
                        </div>
                    </div>

                    <div class="form-floating mb-2">
                        <input type="text" name="price" class="form-control" id="priceInput" placeholder="1">
                        <label for="priceInput">price</label>
                        <div class="valid-feedback">
                        Looks good!
                        </div>
                        <div class="invalid-feedback">
                        Price must be a number and larger than 0!
                        </div>
                    </div>

                    <div class="form-floating mb-2">
                        <input type="text" name="description" class="form-control" id="descriptionInput" placeholder="good item">
                        <label for="descriptionInput">description</label>
                        <div class="valid-feedback">
                        Looks good!
                        </div>
                        <div class="invalid-feedback">
                        Description must not be null and should not longer than 1000 letters!
                        </div>
                    </div>
                    
                    <label for="photosInput">You can upload multiple photos.</label>
                    <input id="photosInput" name="photos" type="file" multiple/>
                    <div class="invalid-feedback">
                        Please upload some photos to describe your item!
                    </div>
                    <div id="filesErrorDiv" class="error" style="visibility: hidden;">
                        Files must all be photos('png','jpg')!
                    </div>

                    <div class="row d-flex justify-content-center">
                        <div class="col-6 d-flex justify-content-center">
                        <button class="col-6 btn btn-primary" type="submit" onclick="newItemFormPost(event)">
                            create
                        </button>
                        </div>
                    </div>

                    <div id="newItemErrorDiv" class="error" style="visibility: hidden;"></div>

                    </form>

                </div>

            </div>

        </div>
    
    `);
}

function newItemFormPost(event) {
    event.preventDefault();

    let inputs = { "title": "", "price": "", "description": "" };

    let flag = true;

    for (let key in inputs) {
        let input = $('#' + key + 'Input');
        if (!(inputs[key] = check(input.val(), key))) {
            flag = false;
            input.removeClass("is-valid");
            input.addClass("is-invalid");
        } else {
            input.removeClass("is-invalid");
            input.addClass("is-valid");
        }
    }

    if ($('#photosInput')[0].files.length == 0) {
        flag = false;
        $('#photosInput').removeClass("is-valid");
        $('#photosInput').addClass("is-invalid");
    } else {
        $('#photosInput').removeClass("is-invalid");
        $('#photphotosInputos').addClass("is-valid");
    }

    $('#filesErrorDiv').css("visibility", "hidden");
    let photos = $('#photosInput')[0].files;
    for (let i = 0; i < photos.length; i++) {
        if (!(/\.(jpg|png)$/.test(photos[i.toString()].name))) {
            errors(["files"], "newItem");
            flag = false;
            break;
        }
    }

    if (flag == true) {
        $.ajax({
            method: 'POST',
            url: '/item/create',
            data: new FormData($('#newItemForm')[0]),
            processData: false,
            contentType: false,
            success: function (responseMessage) {
                // window.location.href = "/stevensMarketPlace";
                // console.log(responseMessage)
                // myItem(responseMessage)
                search();
            },
            error: function (responseMessage) {
                if (responseMessage.status == 400) {
                    errors(responseMessage.responseJSON.errors, "newItem");
                } else if (responseMessage.status == 500) {
                    alert(responseMessage.responseText);
                } else {
                    alert(responseMessage.responseText);
                }

            }
        });
    }

}

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
                                            <li class="breadcrumb-item font-weight-bold "><a class="black-text text-uppercase" href="/"><span class="mr-md-3 mr-1">BACK TO SHOP</span></a><i class="fa fa-angle-double-right " aria-hidden="true"></i></li>
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
                                            <p class="card-text text-muted mt-md-4 mb-2 space">YOUR ORDER <span class=" small text-muted ml-2 cursor-pointer">EDIT SHOPPING BAG</span> </p>
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
                            <a class="align-self-center" onclick="directRemove(event,'${element._id}')">
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

function myProfile(event) {
    if (event != "") {
        event.preventDefault();
    }

    $.ajax({
        method: 'GET',
        url: '/myprofile',
        contentType: 'application/json',
        success: function (responseMessage) {
            let user = responseMessage;
            $('main').html(`
                <div class="row">
                    <div class="col-md-12">
                    <div class="container-fluid col-md-6 mt-3">
                        <form id="userInfoForm" class="needs-validation" novalidate>
                
                        <h1 class="row d-flex justify-content-center mb-3">Profile</h1>
                        <p>Account: ${user.account}</p>
                
                        <div class="form-floating mb-2">
                            <input type="text" class="form-control" id="nicknameInput" placeholder="${user.nickname}" value="${user.nickname}">
                            <label for="nicknameInput">Nickname</label>
                            <div class="valid-feedback">
                            Looks good!
                            </div>
                            <div class="invalid-feedback">
                            Nickname should not be empty!
                            </div>
                        </div>
                
                        <div class="form-floating mb-2">
                            <input type="text" class="form-control" placeholder="Password" value="   " hidden>
                            <label>Gender</label>
                            <select class="form-select border-1" name="gender" id="genderInput" placeholder="${user.gender}" value="${user.gender}">
                                <option value="male" selected>male</option>
                                <option value="female">female</option>
                                <option value="other">other</option>
                            </select>
                            <div class="valid-feedback">
                            Looks good!
                            </div>
                            <div class="invalid-feedback">
                            Gender should be like male/female/other!
                            </div>
                        </div>
                
                        <p>Address</p>
                
                        <div class="row mb-4">
                
                            <div class="col">
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="streetInput" placeholder="${user.address.street}" value="${user.address.street}">
                                <label for="streetInput">Street</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                Street should not be empty!
                                </div>
                            </div>
                            </div>
                
                            <div class="col">
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="aptInput" placeholder="${user.address.apt}" value="${user.address.apt}">
                                <label for="aptInput">Apt</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                Apt should not be empty!
                                </div>
                            </div>
                            </div>
                
                        </div>
                
                        <div class="row mb-4">
                
                            <div class="col">
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="cityInput" placeholder="${user.address.city}" value="${user.address.city}">
                                <label for="cityInput">City</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                City should not be empty!
                                </div>
                            </div>
                            </div>
                
                            <div class="col">
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="stateInput" placeholder="${user.address.state}" value="${user.address.state}">
                                <label for="stateInput">State</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                City should not be empty!
                                </div>
                            </div>
                            </div>
                
                            <div class="col">
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="zipCodeInput" placeholder="${user.address.zipCode}" value="${user.address.zipCode}">
                                <label for="zipCodeInput">ZipCode</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                City should not be empty!
                                </div>
                            </div>
                            </div>
                
                        </div>

                        <div class="error md-4" style="visibility: hidden;" id="addressFormErrorDiv">The relationship of city/state/zipCode is not correct!</div>
                
                        <div id="userInfoFormErrorDiv" class="error" style="visibility: hidden;"></div>

                        <div class="row d-flex justify-content-center">
                            <div class="col-6 d-flex justify-content-center">
                            <button class="col-12 btn btn-primary" type="submit" onclick="userUpdateInfo(event)">
                                Save Changes
                            </button>
                            </div>
                
                        </div>
                
                        </form>
                    </div>
                
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

function userUpdateInfo(event) {
    if (event != "") {
        event.preventDefault();
    }

    let inputs = {
        "nickname": "",
        "gender": "",
        "street": "",
        "apt": "",
        "city": "",
        "state": "",
        "zipCode": ""
    };

    let flag = true, same = true;

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
        if (input.val() != input.attr("placeholder")) {
            same = false;
        }
    }

    if (same) {
        errors(["same"], "userInfo");
        return;
    }

    let addressFormErrorDiv = $('#addressFormErrorDiv');
    if (!checkAddress(inputs.city, inputs.state, inputs.zipCode)) {
        flag = false;
        addressFormErrorDiv.css("visibility", "visible");
    } else {
        addressFormErrorDiv.css("visibility", "hidden");
    }

    if (flag == true) {
        $.ajax({
            method: 'POST',
            url: '/myprofile',
            contentType: 'application/json',
            data: JSON.stringify({
                "nickname": inputs.nickname,
                "gender": inputs.gender,
                "address": {
                    "street": inputs.street,
                    "apt": inputs.apt,
                    "city": inputs.city,
                    "state": inputs.state,
                    "zipCode": inputs.zipCode
                }
            }),
            success: function (responseMessage) {
                alert("Update your infor mation success!")
                myProfile("");
            },
            error: function (responseMessage) {
                if (responseMessage.status == 400) {
                    errors(responseMessage.responseJSON.errors, "userInfo");
                } else if (responseMessage.status == 500) {
                    alert(responseMessage.responseText);
                } else {
                    alert(responseMessage.responseText);
                }
            }
        });
    }
}

function myItems(event) {
    if (event != "") event.preventDefault();

    $('main').html(`
        <div id="items" class="container">
            <h1>Your Items List</h1>
            <hr>
        </div>
    `);

    $.ajax({
        method: 'GET',
        url: '/item/getAll',
        contentType: 'application/json',
        success: function (responseMessage) {
            if (responseMessage.length == 0) {
                $('#items').html($('#items').html() + "<div>You haven't post any items.</div>");
            } else {
                responseMessage.forEach(element => {
                    $('#items').html($('#items').html() + `
                        <div class="row d-flex justify-content-center">
                            <div class="col-2"><img src="/images/${element.photos[0]}" alt="${element.title}" height="50px"></div>
                            <div class="col-2 align-self-center">${element.title}</div>
                            <div class="col-2 align-self-center">${element.description}</div>
                            <div class="col-1 align-self-center">$${element.price}</div>
                            <div class="col-1 align-self-center">${element.status}</div>
                            <div class="col-4 row align-self-center">
                                ${element.status == "selling" ? `   
                                    <div class="col-6"><button onclick="withdrawItem('${element._id}')" class="btn btn-danger">withdraw</button></div>
                                    <div class="col-6"><button onclick="itemUpdateInfo('${element._id}')" class="btn btn-primary">undateInfo</button></div>
                                `
                            : ""}
                            </div>
                        </div>
                        <hr>
                    `);
                });
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

function withdrawItem(item_id) {
    $.ajax({
        method: 'GET',
        url: '/item/withdraw/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            myItems("");
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

function itemUpdateInfo(item_id) {
    // alert("good");
}

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
                        <h1>Transactions</h1>
                    </div>
                    <div class="row">
                        <h4>Sold</h1>
                    </div>
                    <div id="sold">
                    </div>
                    <div class="row">
                        <h4>Bought</h1>
                    </div>
                    <div id="bought">
                    </div>
                </div>
            `);

            if (responseMessage.sold.length == 0) {
                $('#sold').html("<div>You didn't sold anything.</div>");
            } else {
                responseMessage.sold.forEach(element => {
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

            }

            if (responseMessage.bought.length == 0) {
                $('#bought').html("<div>You didn't bought anything.</div>");
            } else {
                responseMessage.bought.forEach(element => {
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
                                    <li>${element.payment.cardNumber}</li>
                                    <li>${element.payment.validDate}</li>
                                    <li>${element.payment.securityCode}</li>
                                <ul>
                            </div>
                            `:
                            ""}
                            
                            <hr class="my-2">
                        </div>
                    `);
                });

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

function chatBox(event) {
    event.preventDefault();
    $('main').html(`
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
        <div class="container">
            <!-- Content wrapper start -->
            <div class="content-wrapper">

                <!-- Row start -->
                <div class="row gutters">

                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                        <div class="card m-0">

                            <!-- Row start -->
                            <div class="row no-gutters">
                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                    <div class="users-container">
                                        <div class="chat-search-box">
                                            <div class="input-group">
                                                <input class="form-control" placeholder="Search">
                                                <div class="input-group-btn">
                                                    <button type="button" class="btn btn-info">
                                                        <i class="fa fa-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <ul class="users">

                                        </ul>
                                    </div>
                                </div>
                                <div class="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                                    <div class="selected-user">
                                        <span>To: <span class="name"></span></span>
                                    </div>


                                    <div class="chat-container ">
                                        <div class="overflow-auto" style="max-height: 60vh;">
                                            <ul class="chat-box chatContainerScroll">
                                            </ul>
                                        </div>

                                        <div class="form-group mt-3 mb-0">
                                            <form id="send">
                                                <textarea id="messageContent" class="form-control" rows="3"
                                                    placeholder="Type your message here..."></textarea>
                                                <button class="btn btn-success mt-2" type="submit">Send</button>
                                            </form>

                                        </div>
                                    </div>



                                </div>
                            </div>
                            <!-- Row end -->
                        </div>

                    </div>

                </div>
                <!-- Row end -->

            </div>
            <!-- Content wrapper end -->

        </div>
    `);
    $.ajax({
        method: 'GET',
        url: "/chat/getAll",
        success: function (responseMessage) {
            responseMessage.chats.forEach(element => {
                $('.users').html($('.users').html() + `
                <li id="${element.users.slice(0, element.users.lastIndexOf('@'))}" class="person" data-chat="${element.users}" onclick="changeChatAim('${element.users.slice(0, element.users.lastIndexOf('@'))}')">
                    <div class="user">
                        <img src="/images/avatar.png" alt="${element.users}">
                        <span id="${element.users.slice(0, element.users.lastIndexOf('@'))}Status" class="status busy"></span>
                    </div>
                    <p class="name-time">
                        <span class="list-name">${element.users.slice(0, element.users.lastIndexOf('@'))}</span>
                        <span class="time">
                        ${new Date().getDate() == new Date(element.messages[element.messages.length - 1].date).getDate() ?
                        new Date(element.messages[element.messages.length - 1].date).toLocaleTimeString('en-US') :
                        new Date(element.messages[element.messages.length - 1].date).toLocaleString('en-US', { timeZone: 'EST' })}
                        </span>
                    </p>
                </li>
                `);
            });
            if ($('.active-user').length == 0) {
                reloadChatBox(responseMessage.chats[0]);
            }
        },
        error: function (responseMessage) {
            alert(responseMessage.responseText);
        }
    });
    $('#send').submit((event) => {
        event.preventDefault();
        alert($('.active-user').attr('id'));
        // console.log($('#messageContent').val())
    });
}

function changeChatAim(account) {
    $.ajax({
        method: 'GET',
        url: "/chat/getOne/" + account + "@stevens.edu",
        success: function (responseMessage) {
            reloadChatBox(responseMessage);
        },
        error: function (responseMessage) {
            alert(responseMessage.responseText);
        }
    });
}

function reloadChatBox(chat) {
    if ($('.active-user').length != 0) {
        $('.active-user').removeClass("active-user");
    }
    $('#' + chat.users.slice(0, chat.users.lastIndexOf('@'))).addClass("active-user");

    $('.name').text(chat.users.slice(0, chat.users.lastIndexOf('@')));
    $('.chat-box').html("")
    chat.messages.forEach(element => {
        if (element.sender == chat.users) {
            $('.chat-box').html($('.chat-box').html() + `
                <li class="chat-left">
                    <div class="chat-avatar">
                        <img src="/images/avatar.png" alt="${element.sender.slice(0, element.sender.lastIndexOf('@'))}">
                        <div class="chat-name">${element.sender.slice(0, element.sender.lastIndexOf('@'))}</div>
                    </div>
                    <div class="chat-text">${element.message}</div>
                    <div class="chat-hour">
                        ${new Date().getDate() == new Date(element.date).getDate() ?
                    new Date(element.date).toLocaleTimeString('en-US') + " Today" :
                    new Date(element.date).toLocaleString('en-US', { timeZone: 'EST' })}
                        <span class="fa fa-check-circle"></span>
                    </div>
                </li>
            `);
        } else {
            $('.chat-box').html($('.chat-box').html() + `
            <li class="chat-right">
                <div class="chat-hour">
                    ${new Date().getDate() == new Date(element.date).getDate() ?
                    new Date(element.date).toLocaleTimeString('en-US') + " Today" :
                    new Date(element.date).toLocaleString('en-US', { timeZone: 'EST' })}
                    <span class="fa fa-check-circle"></span>
                </div>
                <div class="chat-text">${element.message}</div>
                <div class="chat-avatar">
                    <img src="/images/avatar.png" alt="${element.sender.slice(0, element.sender.lastIndexOf('@'))}">
                    <div class="chat-name">${element.sender.slice(0, element.sender.lastIndexOf('@'))}</div>
                </div>
            </li>
        `);
        }

    });
}




