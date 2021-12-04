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
      responseMessage.items.forEach(element => {
        $('#content').html($('#content').html() + `
          <div class="col">
            <div class="card h-100 shadow-sm"> <img src="/images/${element.photos[0]}" class="card-img-top" alt="...">
                <div class="card-body">
                    <div class="clearfix mb-3"> 
                      <span class="float-start badge rounded-pill bg-primary">${element.title}</span> 
                      <span class="float-end price-hp" style="color:red">$${element.price}</span> 
                    </div>
                    <h5 class="card-title">${element.description}</h5>
                    <div class="text-center my-4"> <a href="/item/getOne/${element._id}" class="btn btn-warning">Check Item</a> </div>
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