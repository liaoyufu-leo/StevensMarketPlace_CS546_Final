(function ($) {

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

    $('#forgetPasswordForm').submit(function (event) {
        event.preventDefault();

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
            return ;
        }    

        let inputs = {
            "account": "",
            "password": ""
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
                    window.location.href = "/stevensMarketPlace";
                },
                error: function (responseMessage) {
                    if (responseMessage.status == 400) {
                        errors(responseMessage.responseJSON.errors, "forgetPassword");
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
