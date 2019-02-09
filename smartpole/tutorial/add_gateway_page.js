var url=document.URL;
//document.write(url);
var id = url.substring(url.lastIndexOf('=')+1);

function addgate(){
  console.log("fetching data");

  var gatewayID = $('#gatewayID');
  var ln = $('#latitude');
  var lg = $('#longitude');
  var gc = $('#Gateway_Code');
  $.ajax({
    url: '/gateways',
    method: 'POST',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    data:JSON.stringify({ "gatewayid":gatewayID.val() ,"checkdigit":gc.val(),"sensors":[],"latitude":ln.val() ,"longitude":lg.val() }),
    success: function(response) {
      if (response.Result != "Success")
      {
        alert("Check Details");

      }
      else {
        console.log(response);
        gatewayID.val('');
        ln.val('');
        lg.val('');
        gc.val('');
        //$('#add').click();
        window.location.href="index.html";
      }

    }
  });

}


function getfngate(){
  var gatewayID = $('#gatewayID');
  var ln = $('#latitude');
  var lg = $('#longitude');
  var gc = $('#Gateway_Code');
  $.ajax({
    url: '/gateways/'+id,
    method: 'GET',
    contentType: 'application/json',
    headers:{'x-access-token':localStorage.getItem("token")},

    //data:JSON.stringify({ "sensorid":SenID.val() ,"checkdigit":sc.val() ,"gatewayid":gatewayID.val(),"type":senty.val() ,"latitude":ln.val() ,"longitude":lg.val() }),
    success: function(response) {
      response.forEach(function(sensor) {

        gatewayID.val(sensor.gatewayid);
        gc.val(sensor.checkdigit);
        ln.val(sensor.latitude);
        lg.val(sensor.longitude);
        //$('#add').click();
        //window.location.href="index.html";
      });
    }
  });
}


function updatefngateway(){
  var gatewayID = $('#gatewayID');
  var ln = $('#latitude');
  var lg = $('#longitude');
  var gc = $('#Gateway_Code');
  $.ajax({
    url: '/gateways/'+id,
    method: 'PUT',
    contentType: 'application/json',
    headers:{'x-access-token':localStorage.getItem("token")},
    data:JSON.stringify({ "checkdigit":gc.val() ,"gatewayid":gatewayID.val(),"latitude":ln.val() ,"longitude":lg.val() }),
    success: function(response) {
      console.log("hello");
      location.href="index.html";
      }
    });
}
