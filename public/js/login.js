(function ($) {

    var loginForm = $('#loginForm');

    loginForm.submit(function (event) {
        event.preventDefault();

        var inputs = { "account": "", "password": "" };
        
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

        if (flag == true) {
            $.ajax({
                method: 'POST',
                url: '/user/login',
                contentType: 'application/json',
                data: JSON.stringify(inputs),
                success: function (responseMessage) {
                    window.location.href = "/stevensMarketPlace";
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

    });
})(jQuery);
