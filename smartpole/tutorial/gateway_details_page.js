function getgatewayitem()
{
  var url=document.URL;
  //document.write(url);
  var id = url.substring(url.lastIndexOf('=')+1);
  //sdocument.write(id);
  $.ajax({
      url: '/gateways/'+id,
      method:'GET',
      contentType: 'application/json',
      headers:{'x-access-token':localStorage.getItem("token")},
      success: function(response) {
        var tbodyEl = $('tbody');
      tbodyEl.html('');
      var j=1;
      response.forEach(function(product) {
        var length = product.sensors.length;
        for(var i =0;i<length;i++){
          tbodyEl.append('\
              <tr>\
                  <td>' +  j++ + '</td>\
                  <td class="id">' + product.sensors[i].sensorid + '</td>\
                  <td>' + product.sensors[i].type + '</td>\
                  <td>\
                      <button type="button" class="btn btn-round btn-primary btn-xs sensoritem">Sensor Details</button>\
                      <button class="btn btn-round btn-primary btn-xs delete_sensor" >Delete</button>\
                  </td>\
              </tr>\
          ');
        }

      });
  }
  });
  $('table').on('click', '.sensoritem', function() {

          var rowEl = $(this).closest('tr');
          var id = rowEl.find('.id').text();
          window.location.href="sensor_details.html?id="+id;

        });
        $('table').on('click', '.delete_sensor', function() {

                var rowEl = $(this).closest('tr');
                var id1 = rowEl.find('.id').text();
                $.ajax({
                    url: '/sensors/'+id1,
                    method: 'DELETE',
                    contentType: 'application/json',
                    headers:{'x-access-token':localStorage.getItem("token")},
                    //data:JSON.stringify({ "sensorid":SenID.val() ,"checkdigit":sc.val() ,"gatewayid":gatewayID.val(),"type":senty.val() ,"latitude":ln.val() ,"longitude":lg.val() }),
                    success: function(response) {
                        console.log(response);
                window.location.href="gateway_details.html?id="+id;
                    }
                });

              });
}
