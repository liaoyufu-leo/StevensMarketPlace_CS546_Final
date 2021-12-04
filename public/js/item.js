(function ($) {


})(jQuery);


function addCart(element, item_id) {
    $.ajax({
        method: 'GET',
        url: '/user/addCart/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            if (confirm("You add this item in your cart success! Do you wanna go to cart?")) {
                window.location.href = "/user/cart";
            } else {
                window.location.href = "/item/getOne/"+item_id;
            }
        },
        error: function (responseMessage) {
            if (responseMessage.status == 404) {
                if (confirm("You have already add this item in your cart! Do you wanna go to cart?")) {
                    window.location.href = "/user/cart";
                }else{
                    window.location.href = "/item/getOne/"+item_id;
                }
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}


function removeCart(element, item_id) {
    $.ajax({
        method: 'GET',
        url: '/user/removeCart/' + item_id,
        contentType: 'application/json',
        success: function (responseMessage) {
            if (confirm("You remove this item in your cart success! Do you wanna go to cart?")) {
                window.location.href = "/user/cart";
            } else {
                window.location.href = "/item/getOne/"+item_id;
            }
        },
        error: function (responseMessage) {
            if (responseMessage.status == 404) {
                if (confirm("You don't have this item in your cart! Do you wanna go to cart?")) {
                    window.location.href = "/user/cart";
                }
            } else if (responseMessage.status == 500) {
                alert(responseMessage.responseText);
            } else {
                alert(responseMessage.responseText);
            }

        }
    });
}

// js  item //