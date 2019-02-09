var id;
function getdetails()
{
  id = $('#search_id').val();
  console.log(id);
  $.ajax({
      url: '/sensors/'+id,
      method:'GET',
      contentType: 'application/json',
      headers:{'x-access-token':localStorage.getItem("token")},
      success: function(response) {
        var tbodyEl = $('tbody');
      tbodyEl.html('');
      var j=1;
      response.forEach(function(product) {
          tbodyEl.append('\
              <tr>\
                  <td>' +  j++ + '</td>\
                  <td class="id">' + product.sensorid + '</td>\
                  <td>' + product.gatewayid + '</td>\
                  <td>' + product.type + '</td>\
                  <td>\
                      <button type="button" class="btn btn-round btn-primary btn-xs sensoritem">Sensor Details</button>\
                      <button class="btn btn-round btn-primary btn-xs delete_sensor" >Delete</button>\
                  </td>\
              </tr>\
          ');

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
                window.location.href="search_sensor.html";
                    }
                });

              });
}

function getdetailsbytype()
{
  type = $('#search_type').val();
  console.log(type);
  $.ajax({
      url: '/sensors/search/'+type,
      method:'GET',
      contentType: 'application/json',
      headers:{'x-access-token':localStorage.getItem("token")},
      success: function(response) {
        var tbodyEl = $('tbody');
      tbodyEl.html('');
      var j=1;
      response.forEach(function(product) {
          tbodyEl.append('\
              <tr>\
                  <td>' +  j++ + '</td>\
                  <td class="id">' + product.sensorid + '</td>\
                  <td>' + product.gatewayid + '</td>\
                  <td>' + product.type + '</td>\
                  <td>\
                      <button type="button" class="btn btn-round btn-primary btn-xs sensoritem">Sensor Details</button>\
                      <button class="btn btn-round btn-primary btn-xs delete_sensor" >Delete</button>\
                  </td>\
              </tr>\
          ');

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
                window.location.href="search_sensor.html";
                    }
                });

              });
}
