(function ($) {

    search();

    $('#searchForm').submit(function (event) {
        event.preventDefault();
        if ($('#searchInput').val() == undefined) {
            init();
        } else {
            search();
        }

    });

})(jQuery);


function search() {
    let keyword = $('#searchInput').val();
    $('#content').html("");
    $.ajax({
        method: 'GET',
        url: '/item/search/' + keyword,
        contentType: 'application/json',
        success: function (responseMessage) {
            responseMessage.items.forEach(element => {
                $('#content').html($('#content').html() + `
                <div class="col-md-3" >
                <div class="card" style="height:20vh">
                <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                  <img
                    src="/images/${element.photos[0]}"
                    class="img-fluid"
                  />
                  <a href="#!">
                    <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                  </a>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${element.title}</h5>
                  <p class="card-text">
                    ${element.description}
                  </p>
                  <a href="#!" class="btn btn-primary">Button</a>
                </div>
              </div>
                </div>
                
                `);
            });
        },
        error: function (responseMessage) {
            alert(responseMessage.responseText);
        }
    });
}