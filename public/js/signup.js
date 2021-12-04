(function ($) {

    $('#accountInput').keyup((event) => {

        let account = $('#accountInput').val();

        let nickname = account.slice(0, account.lastIndexOf("@"));

        $('#nicknameInput').val(nickname);
        $('#nicknameInput').addClass("active");

    });


    $('#passwordConfirmInput').keyup((event) => {

        let passwordInput = $('#passwordInput');
        let passwordConfirmInput = $('#passwordConfirmInput');

        if (passwordInput.val() == passwordConfirmInput.val()) {
            passwordConfirmInput.removeClass("is-invalid");
            passwordConfirmInput.addClass("is-valid");
        } else {
            passwordConfirmInput.removeClass("is-valid");
            passwordConfirmInput.addClass("is-invalid");
        }
    });

    $('#signupForm').submit(function (event) {

        let passwordInput = $('#passwordInput');
        let passwordConfirmInput = $('#passwordConfirmInput');

        if (passwordInput.val() != "" && passwordInput.val() == passwordConfirmInput.val()) {
            let formError = $('#passwordConfirmErrorDiv');
            formError.html("");
            passwordConfirmInput.removeClass("is-invalid");
            passwordConfirmInput.addClass("is-valid");
        } else {
            let formError = $('#passwordConfirmErrorDiv');
            formError.html("Please input same password");
            passwordConfirmInput.removeClass("is-valid");
            passwordConfirmInput.addClass("is-invalid");
        }

        event.preventDefault();

        let inputs = {
            "account": "",
            "nickname": "",
            "password": "",
            "gender": "",
            "street": "",
            "apt": "",
            "city": "",
            "state": "",
            "zipCode": ""
        };

        let flag = true;

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
                url: '/user/signup',
                contentType: 'application/json',
                data: JSON.stringify({
                    "account": inputs.account,
                    "nickname": inputs.nickname,
                    "password": inputs.password,
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
                    window.location.href = "/stevensMarketPlace";
                },
                error: function (responseMessage) {
                    if (responseMessage.status == 400) {
                        errors(responseMessage.responseJSON.errors, "signup");
                    } else if (responseMessage.status == 500) {
                        alert(responseMessage.responseText);
                    } else {
                        alert(responseMessage.responseText);
                    }
                }
            });
        }

    });
})(jQuery);
