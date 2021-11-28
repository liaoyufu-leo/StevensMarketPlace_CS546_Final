(function ($) {

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

    $('#forgetPasswordForm').submit(function (event) {

        let passwordInput = $('#passwordInput');
        let passwordConfirmInput = $('#passwordConfirmInput');

        if (passwordInput.val() != "" && passwordInput.val() == passwordConfirmInput.val()) {
            let formError = $('#passwordConfirmErrorDiv');
            formError.html("");
            passwordConfirmInput.removeClass("is-invalid");
            passwordConfirmInput.addClass("is-valid");
        } else {
            let formError = $('#passwordConfirmErrorDiv');
            formError.html("Please input same password.");
            passwordConfirmInput.removeClass("is-valid");
            passwordConfirmInput.addClass("is-invalid");
        }

        event.preventDefault();

        let inputs = {
            "account": "",
            "password": ""
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
        
        if (flag == true) {
            $.ajax({
                method: 'POST',
                url: '/user/forgetPassword',
                contentType: 'application/json',
                data: JSON.stringify({
                    "account": inputs.account,
                    "password": inputs.password

                }),
                success: function (responseMessage) {
                    if (responseMessage.hasErrors) {
                        errors(responseMessage.errors, "signup");
                    } else {
                        window.location.href = "/stevensMarketPlace";
                    }
                },
                error: function (responseMessage) {
                    alert(responseMessage.responseText);
                }
            });
        }

    });
})(jQuery);
