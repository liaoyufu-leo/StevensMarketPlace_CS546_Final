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
                                <option value="male" ${user.gender=="male" ? "selected": ""}>male</option>
                                <option value="female" ${user.gender=="female" ? "selected": ""}>female</option>
                                <option value="other" ${user.gender=="other" ? "selected": ""}>other</option>
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
                                State should not be empty!
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
                                Zipcode should be 5 numbers!
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