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

        for (let key in inputs) {
            let input = $('#' + key + 'Input');
            if (!(inputs[key] = check(input.val(), key))) {
                flag = false;
                input.addClass("is-invalid");
                $('#' + key + 'ErrorDiv').text("Please provide a valid " + key + ".");
            } else {
                input.removeClass("is-invalid");
            }
        }
        
        if (!checkAddress(inputs.city, inputs.state, inputs.zipCode)) {
            flag = false;
            let addressFormErrorDiv = $('#addressFormErrorDiv');
            addressFormErrorDiv.html("The relationship of city/state/zipCode is not correct!");
            addressFormErrorDiv.show();
        } else {
            let addressFormErrorDiv = $('#addressFormErrorDiv');
            addressFormErrorDiv.html();
            addressFormErrorDiv.hide();
        }

        console.log(flag)

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
                    if (responseMessage.hasErrors) {
                        errors(responseMessage.errors, "signup");
                    } else {
                        window.location.href = "/stevensMarketPlace";
                    }
                },
                error: function (responseMessage) {
                    console.log(responseMessage)
                    alert(responseMessage.responseText);
                }
            });
        }

    });
})(jQuery);
