var todate1;
var fromdate1;
var url=document.URL;
//document.write(url);
var id = url.substring(url.lastIndexOf('=')+1);
var days=["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function getdetails()
{
  $.ajax({
    url: '/sensorsdata/'+id,
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      response.forEach(function(sensor) {
        $("#GatewayID").html(sensor.Result[0].GatewayID);
        $("#battery_level").html(sensor.Result[0].Battery+"% is battery");
        $("#DisplayData").html(sensor.Result[0].DisplayData);
      });
    }
  });

  $.ajax({
    url: '/sensors/'+id,
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      response.forEach(function(sensor) {
        $("#Check_digit").html(sensor.checkdigit);
        $("#latitude").html(sensor.latitude);
        $("#longitude").html(sensor.longitude);

      });
    }
  });
}
function getHistory()
{
  var todate =$('#to_date').val();
  var fromdate =$('#from_date').val();
  //console.log(todate);
  //console.log(fromdate);

  //console.log(id);
  $.ajax({
    url: '/sensorsdata/'+id+'/history/'+todate+'/'+fromdate,
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      var i= 1;
      var tbodyEl = $('tbody');
      tbodyEl.html('');
      response.forEach(function(sensor) {
        console.log("in history..");
        sensor.Result.forEach(function(result)
        {
          var values = parseFloat(result.PlotValue);
          var str = result.MessageDate;
          var  tmp = str.substring(6,19);
          var date=new Date(tmp * 1);
          var day = days[date.getDay()];
          var date1 = date.getDate();
          var hours = date.getHours(); // minutes part from the timestamp
          var minutes = date.getMinutes(); // seconds part from the timestamp
          var seconds = date.getSeconds(); // will display time in 10:30:23 format
          var mon = date.getMonth();
          var year1 = date.getFullYear();
          console.log(year1+"year on 1st loop");
          console.log(values);
          var formattedTime = day + ' ' + date1 + '/' + mon + '/' + year1 + ' ' + hours + ':'+ minutes+':'+seconds ;
          tbodyEl.append('\
          <tr>\
        <td>' +  i++ + '</td>\
        <td>' +  formattedTime  + '</td>\
        <td>' +  sensor.Result[0].DisplayData + '</td>\
        <td>'+sensor.Result[0].SignalStrength+'\
        <i class=" fa fa-signal"></i>\
        </td>\
        <td>'+sensor.Result[0].Battery+'\
        <i class="fa fa-bolt"></i>\
        </td>\
        </tr>\
          ');
        });
      });
    }
  });
}


function drawBasic() {
  console.log("badgw");


  /////////////
  $.ajax({
    url: '/sensorsdata/'+id+'/history/'+todate1+'/'+fromdate1,
    method:'GET',
    headers:{'x-access-token':localStorage.getItem("token")},
    contentType: 'application/json',
    success: function(response) {
      var data = new google.visualization.DataTable();
      data.addColumn('datetime', 'X');
      data.addColumn('number', response[0].Result[0].DataTypes);
      var options = {
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: response[0].Result[0].PlotLabels
        },
        pointSize:5
      };
      response.forEach(function(sensor) {
        console.log("Hello");
        sensor.Result.forEach(function(result)
        {
          var values = parseFloat(result.PlotValue);
          var str = result.MessageDate;
          var  tmp = str.substring(6,19);
          var date=new Date(tmp * 1);
          var day = days[date.getDay()];
          var date1 = date.getDate();
          var hours = date.getHours(); // minutes part from the timestamp
          var minutes = date.getMinutes(); // seconds part from the timestamp
          var seconds = date.getSeconds(); // will display time in 10:30:23 format
          var mon = date.getMonth();
          var year1 = date.getFullYear();
          console.log(year1+"year on 1st loop");
          console.log(values);
          data.addRow(
            [new Date(year1,mon,date1,hours,minutes,seconds),values]
          );
        });
      })
      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    }
  });/////////////////////




}
function chartGen(){
  todate1 =$('#to_date1').val();
  fromdate1 =$('#from_date1').val();
  google.charts.load('current',{packages:['corechart','line']});
  google.charts.setOnLoadCallback(drawBasic);

}
function updateSensor(){
  var url=document.URL;
  //document.write(url);
  var id = url.substring(url.lastIndexOf('=')+1);
  location.href="updatesensor.html?id="+id;
}
