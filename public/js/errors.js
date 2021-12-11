function errors(inputs, formType) {
    (function ($) {
        var formError = $('#' + formType + 'FormErrorDiv');
        formError.html("");
        formError.css("visibility", "hidden");

        inputs.forEach(element => {
            switch (element) {
                case "account":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "password":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "nickname":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "gender":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "street":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "apt":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "city":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "state":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "zipCode":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "photos":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "content":
                    $('#' + element + 'Input').addClass("is-invalid");
                    return;
                case "address":
                    $('#' + element + 'formError').css("visibility", "visible");
                    return;
                case "arguments":
                    formError.html("The all arguments of the form are not provided!<br>");
                    formError.css("visibility", "visible");
                    return;
                case "files":
                    $('#filesErrorDiv').css("visibility", "visible");
                    return;
                case "account not exist":
                    formError.html(formError.html() + element + "!<br>");
                    formError.css("visibility", "visible");
                    return;
                case "account exist":
                    formError.html(formError.html() + element + ", please change to another stevens email!<br>");
                    formError.css("visibility", "visible");
                    return;
                case "password not correct":
                    formError.html(formError.html() + element + "!<br>");
                    formError.css("visibility", "visible");
                    return;
                case "same":
                    switch (formType) {
                        case "forgetPassword":
                            formError.html(formError.html() + "New password is the same like your exist password, please use the password to login!" + "!<br>");
                            formError.css("visibility", "visible");
                            return;
                        case "userInfo":
                            formError.html(formError.html() + "You didn't change your information, please change first");
                            formError.css("visibility", "visible");
                            return;
                        case "itemUpdateInfo":
                            formError.html(formError.html() + "You didn't change the item information, please change first");
                            formError.css("visibility", "visible");
                            return;
                    }

                default:
                    return;
            }
        });
    })(jQuery);

}