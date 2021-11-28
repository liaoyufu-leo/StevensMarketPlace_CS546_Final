function errors(inputs, formType) {
    (function ($) {

        var formError = $('#' + formType + 'FormErrorDiv');
        formError.html("");
        formError.hide();

        inputs.forEach(element => {
            switch (element) {
                case "account":
                    $('#' + element + 'Input').addClass("is-invalid");
                    $('#' + element + 'ErrorDiv').html("Please provide a valid " + element + ".");
                    return;
                case "password":
                    $('#' + element + 'Input').addClass("is-invalid");
                    $('#' + element + 'ErrorDiv').html("Please provide a valid " + element + ".");
                    return;
                case "nickname":
                    $('#' + element + 'Input').addClass("is-invalid");
                    $('#' + element + 'ErrorDiv').html("Please provide a valid " + element + ".");
                    return;
                case "gender":
                    $('#' + element + 'Input').addClass("is-invalid");
                    $('#' + element + 'ErrorDiv').html("Please provide a valid " + element + ".");
                    return;
                case "address":
                    $('#' + element + 'FormErrorDiv').html("Please provide a valid " + element + ".");
                    return;
                case "arguments":
                    let addressFormErrorDiv = $('#addressFormErrorDiv');
                    addressFormErrorDiv.html("The relationship of city/state/zipCode is not correct!");
                    addressFormErrorDiv.show();
                    return;
                case "account not exist":
                    formError.html(formError.html() + element + ".<br>");
                    formError.show();
                    return;
                case "account exist":
                    formError.html(formError.html() + element + ".<br>");
                    formError.show();
                    return;
                case "password not correct":
                    formError.html(formError.html() + element + ".<br>");
                    formError.show();
                    return;
                default:
                    return;
            }
        });
    })(jQuery);

}