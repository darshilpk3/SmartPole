var url=document.URL;
//document.write(url);
var id = url.substring(url.lastIndexOf('=')+1);
var SenID = $('#sensorID');
var gatewayID = $('#GatewayID');
var senty = $('#sensortype');
var ln = $('#latitude');
var lg = $('#longitude');
var sc = $('#Sensor_Code');

function addfn(){
  console.log("fetching data");

  var SenID = $('#sensorID');
  var gatewayID = $('#GatewayID');
  var senty = $('#sensortype');
  var ln = $('#latitude');
  var lg = $('#longitude');
  var sc = $('#Sensor_Code');
  console.log(senty.val());
  $.ajax({
    url: '/sensors',
    method: 'POST',
    contentType: 'application/json',
    headers:{'x-access-token':localStorage.getItem("token")},
    data:JSON.stringify({ "sensorid":SenID.val() ,"checkdigit":sc.val() ,"gatewayid":gatewayID.val(),"type":senty.val() ,"latitude":ln.val() ,"longitude":lg.val() }),
    success: function(response) {
      if (response.Result != "Success")
      {
        alert("Check Details");

      }
      else {
        console.log(response);
        SenID.val('');
        gatewayID.val('');
        senty.val('');
        ln.val('');
        lg.val('');
        sc.val('');
        //$('#add').click();
        window.location.href="front_page.html";
      }
    }
  });

}
function updatefn(){
  $.ajax({
    url: '/sensors/'+id,
    method: 'PUT',
    contentType: 'application/json',
    headers:{'x-access-token':localStorage.getItem("token")},
    data:JSON.stringify({ "sensorid":SenID.val() ,"checkdigit":sc.val() ,"gatewayid":gatewayID.val(),"type":senty.val() ,"latitude":ln.val() ,"longitude":lg.val() }),
    success: function(response) {
      //console.log("hello");
      location.href="sensor_details.html?id="+id;
      }
    });
}

function getfn(){

  $.ajax({
    url: '/sensors/'+id,
    method: 'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    //data:JSON.stringify({ "sensorid":SenID.val() ,"checkdigit":sc.val() ,"gatewayid":gatewayID.val(),"type":senty.val() ,"latitude":ln.val() ,"longitude":lg.val() }),
    success: function(response) {
      response.forEach(function(sensor) {
        SenID.val(sensor.sensorid);
        gatewayID.val(sensor.gatewayid);
        senty.val(sensor.type);
        ln.val(sensor.latitude);
        lg.val(sensor.longitude);
        sc.val(sensor.checkdigit);
        //$('#add').click();
        //window.location.href="index.html";
      });
    }
  });
}
function getgatewayno()
{
  $.ajax({
    url: '/gateways',
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      var selEl = $('select');
      selEl.html('');
      var i = 1;
      response.forEach(function(product) {
        selEl.append('\
        <option value =' + product.gatewayid +' >'+product.gatewayid +'\
        </option>\
        ');
      });
    }
  });
}
