

function myItems(event) {
    if (event != "") event.preventDefault();

    $('main').html(`
        <div id="items" class="container">
            <h1>Your Items List</h1>
            <hr>
            <div class="row d-flex justify-content-center">
                <div class="col-2">Photo</div>
                <div class="col-2 align-self-center">Title</div>
                <div class="col-2 align-self-center">Description</div>
                <div class="col-1 align-self-center">Price</div>
                <div class="col-1 align-self-center">Status</div>
                <div class="col-4 row align-self-center">Actions</div>
            </div>
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
                                    <div class="col-6"><button onclick="itemUpdateInfo('${element._id}')" class="btn btn-primary">updateInfo</button></div>
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
    $.ajax({
        method: 'GET',
        url: '/item/getOne/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            let item = responseMessage.item;
            let exist = responseMessage.exist;
            $('main').html(`
                <div class="row" style="height:30px;"></div>
                <div class="row">
                    <div class="col-5 offset-1 justify-content-center border bg-dark"  style="height:30vh;">
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
                        <form id="itemUpdateInfoForm" class="needs-validation" novalidate>
                            <h1 class="row d-flex justify-content-center mb-3">Update Item Info</h1>
                            <div class="form-floating mb-2">
                                <input type="text" name="item_id" class="form-control" id="item_idInput" placeholder="${item._id}" value="${item._id}" readonly>
                                <label for="titleInput">item_id</label>
                            </div>

                            <div class="form-floating mb-2">
                                <input type="text" name="title" class="form-control" id="titleInput" placeholder="${item.title}" value="${item.title}">
                                <label for="titleInput">title</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                Title must not be null and not longer than 100 letters!
                                </div>
                            </div>

                            <div class="form-floating mb-2">
                                <input type="text" name="price" class="form-control" id="priceInput" placeholder="${item.price}" value="${item.price}">
                                <label for="priceInput">price</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                Price must be a number and larger than 0!
                                </div>
                            </div>

                            <div class="form-floating mb-2">
                                <input type="text" name="description" class="form-control" id="descriptionInput" placeholder="${item.description}" value="${item.description}">
                                <label for="descriptionInput">description</label>
                                <div class="valid-feedback">
                                Looks good!
                                </div>
                                <div class="invalid-feedback">
                                Description must not be null and should not longer than 1000 letters!
                                </div>
                            </div>
                            
                            <label for="photosInput">You can upload multiple photos, and will not delete previous photos.</label>
                            <input id="photosInput" name="photos" type="file" multiple/>
                            <div class="invalid-feedback">
                                Please upload some photos to describe your item!
                            </div>
                            <div id="filesErrorDiv" class="error" style="visibility: hidden;">
                                Files must all be photos('png','jpg')!
                            </div>

                            <div class="row d-flex justify-content-center">
                                <div class="col-6 d-flex justify-content-center">
                                <button class="btn btn-primary" type="submit" onclick="itemUpdateInfoFormPost(event,'${item._id}')">
                                    Save Changes
                                </button>
                                </div>
                            </div>
                            <div id="itemUpdateInfoFormErrorDiv" class="error" style="visibility: hidden;"></div>
                        </form>
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

function itemUpdateInfoFormPost(event, item_id) {
    event.preventDefault();

    let inputs = { "title": "", "price": "", "description": "" };

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

    if (same && $('#photosInput')[0].files.length == 0) {
        errors(["same"], "itemUpdateInfo");
        return;
    }

    if (flag == true) {
        $.ajax({
            method: 'POST',
            url: '/item/update',
            data: new FormData($('#itemUpdateInfoForm')[0]),
            processData: false,
            contentType: false,
            success: function (responseMessage) {
                myItems("");
            },
            error: function (responseMessage) {
                console.log(responseMessage);
                if (responseMessage.status == 400) {
                    errors(responseMessage.responseJSON.errors, "itemUpdateInfo");
                } else if (responseMessage.status == 500) {
                    alert(responseMessage.responseText);
                } else {
                    alert(responseMessage.responseText);
                }

            }
        });
    }

}