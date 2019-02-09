var https = require('https')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/smartpole');
var db = mongoose.connection;
var Q = require ('q');
var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var asyncLoop = require('node-async-loop');
function chartdata(id,i){



}
//get sensors
module.exports.getSensorDetails = function(callback){
  db.collection("sensordetails").find({},{_id:0}).toArray(function(err, result) {
    if (err) throw err;
    return callback(err, result);
  });
}

module.exports.getSensorDetailsById = function(id,callback){
  db.collection("sensordetails").find({sensorid:id},{_id:0}).toArray(function(err, result) {
    if (err) throw err;
    //console.log(result[0].sensorid);
    return callback(err, result);
  });
}

//getrecentsensordatabyid
module.exports.getRecentDataById = function(id,callback){
  db.collection("sensorData").find({'Result.SensorID':+id},{'Result.DisplayData':1,'Result.PlotValue':1,'Result.GatewayID':1,'Result.Battery':1,_id:0}).sort({$natural:-1}).limit(1).toArray(function(err, result) {
    if (err) throw err;
    return callback(err,result);
  });
}

//gethistorysensorbyid
module.exports.getHistoryDataById = function(id,callback){
  db.collection("sensorData").find({'Result.SensorID':+id}).toArray(function(err, result) {
    if (err) throw err;
    return callback(err,result);
  });
}

//getting data of sensor with help of to and from date
function convertToJSONDate(strDate){
    var dt = new Date(strDate);
    var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return '/Date(' + newDate.getTime() + ')/';
}

module.exports.getHistoryDate = function(id,todate,fromdate,callback){


  var start_mon = parseInt(todate.substring(0,2));

  var end_mon = parseInt(fromdate.substring(0,2));
  //console.log(start_mon+'From sensor.js');
  //var start_mon = todate.substring(0,2);
  var start_date = convertToJSONDate(todate.substring(3,5)+" "+month[start_mon - 1]+" "+todate.substring(6,10));
  var xyz = parseInt(fromdate.substring(3,5))+1;
  console.log(xyz);
  var end_date = convertToJSONDate(xyz+" "+month[end_mon - 1]+" "+fromdate.substring(6,10));
  console.log(start_date);
  console.log(end_date);
  db.collection("sensorData").find({'Result.SensorID':+id,'Result.MessageDate':{$gte:start_date,$lte:end_date}}).toArray(function(err, result) {
    //console.log(result);
    if (err) throw err;
    return callback(err,result);
  });
}
// add sensor
module.exports.addSensor = function(sensor,callback){

  var options={

     host: 'www.imonnit.com',
     path: '/json/AssignSensor/a3Jpc2gubWVodGE6a3Jpc2h2aXNoZXNo?networkID=24691&sensorID='+sensor.sensorid+'&checkDigit='+sensor.checkdigit,
     method: 'GET'

  };
  https.request(options, function(res){
      var body = '';
      res.on('data',function(chunk){
          body+= chunk;
      });
      res.on('end', function(){

          var result = JSON.parse(body);
          if(result.Result == "Success"){
            db.collection("sensordetails").insert(sensor);
            db.collection("gatewaydetails").update({gatewayid:sensor.gatewayid},{$push:{"sensors":{"sensorid":sensor.sensorid, "type":sensor.type}}});
          }
          return callback(null,result);

      });
      res.on('error',callback)
  })
  .on('error',callback)
  .end();
}

// Delete sensor
module.exports.deleteSensor = function(id,callback){
  var options={

     host: 'www.imonnit.com',
     path: '/json/RemoveSensor/a3Jpc2gubWVodGE6a3Jpc2h2aXNoZXNo?sensorID='+id,
     method: 'GET'

  };
  https.request(options, function(res){
      var body = '';
      res.on('data',function(chunk){
          body+= chunk;
      });
      res.on('end', function(){

          var result = JSON.parse(body);
          if(result.Result == "Success"){
            db.collection("sensordetails").remove({'sensorid':id})
            db.collection("gatewaydetails").update({},{$pull:{'sensors':{'sensorid':id}}},{multi:true});
          }
          return callback(null,result);

      });
      res.on('error',callback)
  })
  .on('error',callback)
  .end();
}

// update sensor
module.exports.updateSensor = function(id,sensor,callback){
  db.collection("sensordetails").update({'sensorid':id},{$set:sensor})
  return callback();
}

//search sensor by type

module.exports.getSensorDetailsByType = function(type1,callback){
  db.collection("sensordetails").find({type:type1},{_id:0}).toArray(function(err, result) {
    if (err) throw err;
    return callback(err, result);
  });
}
