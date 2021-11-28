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
                input.addClass("is-invalid");
                $('#' + key + 'ErrorDiv').text("Please provide a valid "+key+".");
            } else {
                input.removeClass("is-invalid");
            }
        }

        if (flag == true) {
            $.ajax({
                method: 'POST',
                url: '/user/login',
                contentType: 'application/json',
                data: JSON.stringify(inputs),
                success: function (responseMessage) {
                    if (responseMessage.hasErrors) {
                        errors(responseMessage.errors, "login");
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
