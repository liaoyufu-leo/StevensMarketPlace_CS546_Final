function errors(inputs, formType) {
    (function ($) {
        var aimForm = $('#' + formType + 'Form');
        var formError = $('#' + formType + 'FormError');
        formError.html("");
        formError.hide();

        inputs.forEach(element => {
            switch (element) {
                case "account":
                    $('#' + element + 'Div').addClass("error");
                    return;
                case "password":
                    $('#' + element + 'Div').addClass("error");
                    return;
                case "arguments":
                    formError.html(formError.html() + element + "<br>");
                    formError.show();
                    return;
                case "account not exist":
                    formError.html(formError.html() + element + "<br>");
                    formError.show();
                    return;
                case "password not correct":
                    formError.html(formError.html() + element + "<br>");
                    formError.show();
                    return;
                default:
            }
        });

    })(jQuery);

}