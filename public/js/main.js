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
                        <a class="text-dark text-decoration-underline" href="/user/getOne/${item.seller}">Seller:
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
                                <button type="submit" class="btn btn-primary fw-bold">
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
                    onclick="removeCart(this,'${item._id}')">
                    Remove Cart
                </button>
                `);
            } else {
                $('#addOrRemove').html(`
                <button type="submit" class="btn fw-bold text-light" style="background-color:var(--stevensRed)"
                    onclick="addCart(this,'${item._id}')">
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
                        new Date(element.date).toLocaleTimeString('en-US') :
                        new Date(element.date).toLocaleString('en-US', { timeZone: 'UTC' })}
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

function addCart(element, item_id) {
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

function removeCart(element, item_id) {
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
                                            <li class="breadcrumb-item font-weight-bold"><a class="black-text text-uppercase active-2" href="#"><span class="mr-md-3 mr-1">CHECKOUT</span></a></li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <div class="row justify-content-around">
                                <div class="col-md-5">
                                    <div class="card border-0">
                                        <div class="card-header pb-0">
                                            <h2 class="card-title space ">Checkout</h2>
                                            <p class="card-text text-muted mt-4 space">SHIPPING DETAILS</p>
                                            <hr class="my-0">
                                        </div>
                                        <div class="card-body">
                                            <div class="row justify-content-between">
                                                <div class="col-auto mt-0">
                                                    <p>Stevens MarketPlace</p>
                                                </div>
                                                <div class="col-auto">
                                                    <p>Please type fake creadit card details!</p>
                                                </div>
                                            </div>
                                            <div class="row mt-4">
                                                <div class="col">
                                                    <p class="text-muted mb-2">PAYMENT DETAILS</p>
                                                    <hr class="mt-0">
                                                </div>
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
                                            <div class="row justify-content-between">
                                                <div class="col-auto col-md-7">
                                                    <div class="media flex-column flex-sm-row"> <img class=" img-fluid" src="https://i.imgur.com/6oHix28.jpg" width="62" height="62">
                                                        <div class="media-body my-auto">
                                                                <div class="row ">
                                                                    <div class="col-auto">
                                                                        <p class="mb-0"><b>EC-GO Bag Standard</b></p><small class="text-muted">1 Week Subscription</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class=" pl-0 flex-sm-col col-auto my-auto">
                                                        <p class="boxed-1">2</p>
                                                    </div>
                                                    <div class=" pl-0 flex-sm-col col-auto my-auto ">
                                                        <p><b>179 SEK</b></p>
                                                    </div>
                                                </div>
                                                <hr class="my-2">
                                                <div class="row justify-content-between">
                                                    <div class="col-auto col-md-7">
                                                        <div class="media flex-column flex-sm-row"> <img class=" img-fluid " src="https://i.imgur.com/9MHvALb.jpg" width="62" height="62">
                                                            <div class="media-body my-auto">
                                                                <div class="row ">
                                                                    <div class="col">
                                                                        <p class="mb-0"><b>EC-GO Bag Standard</b></p><small class="text-muted">2 Week Subscription</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="pl-0 flex-sm-col col-auto my-auto">
                                                        <p class="boxed">3</p>
                                                    </div>
                                                    <div class="pl-0 flex-sm-col col-auto my-auto">
                                                        <p><b>179 SEK</b></p>
                                                    </div>
                                                </div>
                                                <hr class="my-2">
                                                <div class="row justify-content-between">
                                                    <div class="col-auto col-md-7">
                                                        <div class="media flex-column flex-sm-row"> <img class=" img-fluid " src="https://i.imgur.com/6oHix28.jpg" width="62" height="62">
                                                            <div class="media-body my-auto">
                                                                <div class="row ">
                                                                    <div class="col">
                                                                        <p class="mb-0"><b>EC-GO Bag Standard</b></p><small class="text-muted">2 Week Subscription</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="pl-0 flex-sm-col col-auto my-auto">
                                                        <p class="boxed-1">2</p>
                                                    </div>
                                                    <div class="pl-0 flex-sm-col col-auto my-auto">
                                                        <p><b>179 SEK</b></p>
                                                    </div>
                                                </div>
                                                <hr class="my-2">
                                                <div class="row ">
                                                    <div class="col">
                                                        <div class="row justify-content-between">
                                                            <div class="col-4">
                                                                <p class="mb-1"><b>Subtotal</b></p>
                                                            </div>
                                                            <div class="flex-sm-col col-auto">
                                                                <p class="mb-1"><b>179 SEK</b></p>
                                                            </div>
                                                        </div>
                                                        <div class="row justify-content-between">
                                                            <div class="col">
                                                                <p class="mb-1"><b>Shipping</b></p>
                                                            </div>
                                                            <div class="flex-sm-col col-auto">
                                                                <p class="mb-1"><b>0 SEK</b></p>
                                                            </div>
                                                        </div>
                                                        <div class="row justify-content-between">
                                                            <div class="col-4">
                                                                <p><b>Total</b></p>
                                                            </div>
                                                            <div class="flex-sm-col col-auto">
                                                                <p class="mb-1"><b>537 SEK</b></p>
                                                            </div>
                                                        </div>
                                                        <hr class="my-0">
                                                    </div>
                                                </div>
                                                <div class="row mb-5 mt-4 ">
                                                    <div class="col-md-7 col-lg-6 mx-auto"><button type="button" class="btn btn-block btn-outline-primary btn-lg">ADD GIFT CODE</button></div>
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
                <li id="${element.users.slice(0, element.users.lastIndexOf('@'))}" class="person" data-chat="${element.users}" onclick="change('${element.users.slice(0, element.users.lastIndexOf('@'))}')">
                    <div class="user">
                        <img src="/images/avatar.png" alt="${element.users}">
                        <span id="${element.users.slice(0, element.users.lastIndexOf('@'))}Status" class="status busy"></span>
                    </div>
                    <p class="name-time">
                        <span class="list-name">${element.users.slice(0, element.users.lastIndexOf('@'))}</span>
                        <span class="time">
                        ${new Date().getDate() == new Date(element.messages[element.messages.length - 1].date).getDate() ?
                        new Date(element.messages[element.messages.length - 1].date).toLocaleTimeString('en-US') :
                        new Date(element.messages[element.messages.length - 1].date).toLocaleString('en-US', { timeZone: 'UTC' })}
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
        console.log($('#messageContent').val())
    });
}

function change(account) {
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
                    new Date(element.date).toLocaleTimeString('en-US') :
                    new Date(element.date).toLocaleString('en-US', { timeZone: 'UTC' })}
                        <span class="fa fa-check-circle"></span>
                    </div>
                </li>
            `);
        } else {
            $('.chat-box').html($('.chat-box').html() + `
            <li class="chat-right">
                <div class="chat-hour">
                    ${new Date().getDate() == new Date(element.date).getDate() ?
                    new Date(element.date).toLocaleTimeString('en-US') :
                    new Date(element.date).toLocaleString('en-US', { timeZone: 'UTC' })}
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

function myItems(item) {
    $('main').html(`
        <div class="row">
            <div class="col-md-12">
                <div class="container-fluid col-md-6 mt-3">
                    <form id="newItemForm" class="needs-validation" novalidate>

                    <h1 class="row d-flex justify-content-center mb-3">Item Information</h1>

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

