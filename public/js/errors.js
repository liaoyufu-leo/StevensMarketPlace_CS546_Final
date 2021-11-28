function errors(inputs, formType) {
    (function ($) {

        var formError = $('#' + formType + 'FormErrorDiv');
        formError.html("");
        formError.hide();

        inputs.forEach(element => {
            switch (element) {
                case "account":
                    $('#' + element + 'Input').addClass("is-invalid");
                    $('#' + element + 'ErrorDiv').text("Please provide a valid " + element + ".");
                    return;
                case "password":
                    $('#' + element + 'Input').addClass("is-invalid");
                    $('#' + element + 'ErrorDiv').text("Please provide a valid " + element + ".");
                    return;
                case "arguments":
                    formError.html(formError.html() + "Please provide full " + element + ".<br>");
                    formError.show();
                    return;
                case "account not exist":
                    formError.html(formError.html() + element + ".<br>");
                    formError.show();
                    return;
                case "password not correct":
                    formError.html(formError.html() + element + ".<br>");
                    formError.show();
                    return;
                default:
            }
        });

        console.log(formError.html())
    })(jQuery);

}