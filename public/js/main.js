search();

var socket = io();
socket.emit('join', $('#currentUser').html());

(function ($) {

    $('#searchForm').submit(function (event) {
        event.preventDefault();
        search();
    });

})(jQuery);

function search() {

    let keyword = $('#searchInput').val();
    $('#content').html("");
    $.ajax({
        method: 'GET',
        url: '/item/search/?keyword=' + keyword,
        contentType: 'application/json',
        success: function (responseMessage) {
            $('main').html(`
            <div class="container-fluid bg-trasparent my-4 p-3" style="position: relative;">
                <h1>Items Lists</h1><h2></h2><h3></h3><h4></h4>
                <div id="content" class="row row-cols-1 row-cols-xs-2 row-cols-sm-2 row-cols-lg-4 g-3">
                </div>
            </div>
        `);
            if (responseMessage.items.length == 0) {
                $('#content').html("<p style='color: var(--stevensRed);'>Sorry, nothing related to your search!</p>");
            } else {
                responseMessage.items.forEach(element => {
                    $('#content').html($('#content').html() + `
                    <div class="col">
                    <div class="card h-100 shadow-sm"> <img src="/images/${element.photos[0]}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="clearfix mb-3"> 
                                <span class="float-start badge rounded-pill bg-primary">${element.title}</span> 
                                <span class="float-end price-hp" style="color:var(--stevensRed)">$${element.price}</span> 
                            </div>
                            <h5 class="card-title">${element.description}</h5>
                            <div class="text-center my-4"> <a href="/item/getOne/${element._id}" onClick=getItem(event,'${element._id}') class="btn btn-warning">Check Item</a> </div>
                        </div>
                    </div>
                    </div>
                `);
                });
            }

        },
        error: function (responseMessage) {
            alert(responseMessage.responseText);
        }
    });
}
