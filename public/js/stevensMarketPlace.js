(function ($) {

  search();

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
          <div class="col-3">
            <div style="height:2rem"></div>
            <div class="card border border-primary shadow-0 ">
              <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                <img src="/images/${element.photos[0]}" class="img-fluid" style="height:10rem;"/>
                <a href="/item/getOne/${element._id}">
                  <div class="mask" style="background-color: rgba(251, 251, 251, 0.15)"></div>
                </a>
              </div>
          
              <div class="card-body">
                <div class="row">
                  <h5 class="col-6 card-title">${element.title}</h5>
                  <a class="col-6 text-end text-dark text-decoration-underline" href="/user/getOne/${element.seller}">${element.seller.slice(0, element.seller.lastIndexOf('@'))}</a>
                </div>
                
                <p class="card-text"">
                  ${element.description}
                </p>
              </div>
              <div class="card-footer">
                <div class="row">
                  <h5 class="col-6 text-danger fw-bold">$${element.price}</h5>
                  <p class="col-6 text-end text-dark">${new Date(element.date).toISOString().split('T')[0]}</p>
                  <a href='cart' class="btn btn-danger" id="likeID">Add to cart</a>
                  <a href='Buy' class="btn btn-danger" id="likeID">Buy</a>


                </div>
                
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