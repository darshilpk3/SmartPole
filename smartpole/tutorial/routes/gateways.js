var https = require('https')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/smartpole');
var db = mongoose.connection;
//get gateways
module.exports.getGateways = function(callback){
        db.collection("gatewaydetails").find({},{_id:0}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        return callback(err, result);
        db.close();
        });
}
//get details of the gateways
module.exports.getGatewayDataById = function(id,callback){
    db.collection("gatewaydetails").find({gatewayid:id},{_id:0}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      return callback(err,result);
      db.close();
    });
}

// delete the gateway

module.exports.deleteGateway = function(id,callback){

  var options={

     host: 'www.imonnit.com',
     path: '/json/RemoveGateway/a3Jpc2gubWVodGE6a3Jpc2h2aXNoZXNo?gatewayID='+id,
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
            db.collection("gatewaydetails").remove({gatewayid:id});
            db.collection("sensordetails").remove({gatewayid:id});
          }
          return callback(null,result);

      });
      res.on('error',callback)
  })
  .on('error',callback)
  .end();
}

//add the gateway

module.exports.addGateway = function(gateway,callback){
  var options={

     host: 'www.imonnit.com',
     path: '/json/AssignGateway/a3Jpc2gubWVodGE6a3Jpc2h2aXNoZXNo?networkID=24691&gatewayID='+gateway.gatewayid+'&checkDigit='+gateway.checkdigit,
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
            db.collection("gatewaydetails").insert(gateway);
          }
          return callback(null,result);

      });
      res.on('error',callback)
  })
  .on('error',callback)
  .end();
}


// update gateway
module.exports.updateGateway = function(id,gateway,callback){
  db.collection("gatewaydetails").update({gatewayid:id},{$set:gateway})
  return callback();
  db.close();
}
