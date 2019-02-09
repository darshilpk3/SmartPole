var locations = [];
var id = [];
var lat = [];
var long = [];
var data = [];
var datas = [];
var map, heatmap;
var flag = false;
var hello = [];

function xyz(){
  heatmap.setMap(heatmap.getMap() ? null : map);
}
function getPoints()
{
  $.ajax({
    url: '/sensors',
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      var j = 0;
      console.log(response.length+"len of res");
      for( var i=0;i<response.length;i++)
       {
        if( response[i].type == "TEMP"){
          lat[j] = response[i].latitude;
          long[j] = response[i].longitude;
          id[j] = response[i].sensorid;
          console.log(lat[j]+" "+long[j]+" "+id[j]);
          j++;
        }
          if(i>= response.length-1)
          {
            getPoints2();
          }
      }

    }
  });
  //console.log(lat + "latitudes");
}

function getPoints2(){
  var j=0;
  console.log("length"+id.length);
  for(var i=0;i<id.length;i++){
    console.log("i value is: "+i);
      $.ajax({
        url: '/sensorsdata/'+id[i],
        method:'GET',
        headers:{'x-access-token':localStorage.getItem("token")},
        contentType: 'application/json',
        success: function(response) {
            data[j] = response[0].Result[0].PlotValue;
            console.log(data[j]);
            j++;
            if(j==id.length)
            {
              console.log("going to points3");
              getPoints3();
            }
        }
      });
    console.log("parth");
  }
}

function getPoints3() {
  console.log("points3");
  for(var i=0;i<data.length;i++){
    console.log(data[i]+" "+lat[i]+" "+long[i]);
    var weightedLoc = {
        location: new google.maps.LatLng(lat[i],long[i]),
        weight: parseFloat(data[i])
      };
    datas.push(weightedLoc);
    console.log(datas[i]);
    if ( i>= data.length-1)
    {
      console.log("returning "+datas.length+" Data");
    }
  }

}

function getgatewaydetails()
{
  $.ajax({
    url: '/gateways',
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      var tbodyEl = $('tbody');
      tbodyEl.html('');
      var i = 1;
      response.forEach(function(product) {
        tbodyEl.append('\
        <tr>\
        <td>' +  i++ + '</td>\
        <td class="id">' + product.gatewayid + '</td>\
        <td>' +  product.checkdigit + '</td>\
        <td>' +  product.latitude + '</td>\
        <td>' +  product.longitude + '</td>\
        <td>\
        <button type="button" class="btn btn-round btn-primary btn-xs gatewayitem"> Gateway Details </button>\
        <button class="btn btn-round btn-primary btn-xs delete_gateway" >Delete </button>\
        <button class="btn btn-round btn-primary btn-xs update_gateway" > Update </button>\
        </td>\
        </tr>\
        ');
      });
    }
  });
  $('table').on('click', '.gatewayitem', function() {

    var rowEl = $(this).closest('tr');
    var id = rowEl.find('.id').text();
    window.location.href="gateway_details.html?id="+id;

  });
  $('table').on('click', '.delete_gateway', function() {

    var rowEl = $(this).closest('tr');
    var id1 = rowEl.find('.id').text();
    $.ajax({
      url: '/gateways/'+id1,
      method: 'DELETE',
      contentType: 'application/json',
      headers:{'x-access-token':localStorage.getItem("token")},
      //data:JSON.stringify({ "sensorid":SenID.val() ,"checkdigit":sc.val() ,"gatewayid":gatewayID.val(),"type":senty.val() ,"latitude":ln.val() ,"longitude":lg.val() }),
      success: function(response) {
        window.location.href="index.html";
      }
    });

  });
  $('table').on('click', '.update_gateway', function() {

    var rowEl = $(this).closest('tr');
    var id = rowEl.find('.id').text();
    window.location.href="update_gateway.html?id="+id;

  });

}


function getNumberOfGateways()
{
  $.ajax({
    url: '/gateways',
    method:'GET',
    contentType: 'application/json',
    headers:{'x-access-token':localStorage.getItem("token")},
    success: function(response) {
      var tbodyEl = $('tbody');
      tbodyEl.html('');
      var i = 0;
      response.forEach(function(product) {
        i++;
      });
      $("#NumberOfGateways").html(i);
    }
  });
}

function getNumberOfSensors()
{
  $.ajax({
    url: '/sensors',
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      var tbodyEl = $('tbody');
      tbodyEl.html('');
      var i = 0;
      response.forEach(function(product) {
        i++;
      });
      $("#NumberOfSensors").html(i);
    }
  });
}

function getNumberOfData()
{
  $.ajax({
    url: '/data',
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      var tbodyEl = $('tbody');
      tbodyEl.html('');
      $("#NumberOfData").html(response);

    }
  });
}

function initMap()
{
   map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 22.2587, lng: 71.1924},
    mapTypeId: 'satellite'

  });

  $.ajax({
    url: '/gateways',
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      response.forEach(function(product) {
        //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var marker = new google.maps.Marker({
          position:{lat : parseFloat(product.latitude), lng : parseFloat(product.longitude)},
          map:map,
          id : product.gatewayid,
          label:product.gatewayid
        });
        google.maps.event.addListener(marker, 'click', function(evt) {
          var id = marker.get("id");
          window.location.href='gateway_details.html?id='+ id;
        });
      });
    }
  });
}

function heatmap(){
    if(flag){
      flag=false;
      initMap();
    }
    else{
      flag=true;
      heatmap1 = new google.maps.visualization.HeatmapLayer({
      data: datas,
      radius:30,
      map:map
      });
    }

  }

function getValues(){
  return [];
}
