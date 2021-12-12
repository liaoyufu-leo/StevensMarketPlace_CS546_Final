

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

                    <div id="newItemFormErrorDiv" class="error" style="visibility: hidden;"></div>

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
                myItems("");
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