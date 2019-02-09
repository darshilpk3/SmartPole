var https = require('https')
var fs = require ('fs')
var int = 0;
var strJson =[];
var i=0;
var Q = require('q');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/smartpole";
var myDB = undefined;
var request = require('request');

function getJSON() {
  Q.fcall  (function(){
    try {
      return MongoClient.connect(url);
    } catch (e) {
      console.log (e);
    }
  } ).then (function (db) {
    var arr = db.collection("sensordetails").find({},{sensorid:1,_id:0}).toArray();
    db.close();
    return arr;
  }).then(function (arr){
    console.log('data');
    console.log(arr);
      for (var i = 0; i < arr.length;i++) {
      console.log(i);
      strJson [i] = arr[i].sensorid;
    }
    return strJson;

  }).then(function(strJ) {
    console.log('strJSON');
    console.log(strJson);
    i = 0;
    while(i<strJson.length){
      var options={
          host: 'www.imonnit.com',
          path: '/json/SensorRecentDataMessages/a3Jpc2gubWVodGE6a3Jpc2h2aXNoZXNo?sensorID='+strJson[i]+'&minutes=10&lastDataMessageGUID=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          method: 'GET',
      };
      https.request(options, function(res){
          var body = '';
          res.on('data',function(chunk){
              body+= chunk;
          });
          res.on('end', function(){
              var result = JSON.parse(body);
              console.log(result);
              request({
                url: 'http://localhost:4000/data',
                method: 'POST',
                json:true,
                headers:{
                  "content-type":"application/json",
                },
                body: result

              },function(error,response,body){
                if(!error && response.statusCode ===200)
                {
                  console.log(body);
                }
                else {
                  console.log(error);
                }
              });

          });
          res.on('error',function(){ console.log("error");});
      })
      .on('error',function(){ console.log("error");})
      .end();
      console.log(strJson[i]);
      i++;
    }
  });
}

setInterval(function() { getJSON(); }, 150000);
