var battery;
var height;
var url=document.URL;
//document.write(url);
var id = url.substring(url.lastIndexOf('=')+1);
console.log(id);
$.ajax({
  url: '/sensorsdata/'+id,
  method:'GET',
  headers:{'x-access-token':localStorage.getItem("token")},
  contentType: 'application/json',
  success: function(response) {
      battery=response[0].Result[0].Battery;
      console.log(battery);
      battery=100-battery;
      $("div").attr("data-amount",battery);
      var amount = $('.tk').attr('data-amount'),
          height = amount * 80/100 + 20;
          console.log(height);
      $('.lq').css({height : height + '%'});

 }
});
