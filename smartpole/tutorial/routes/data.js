var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/smartpole');
var db = mongoose.connection;


//push data
module.exports.pushData = function(data,callback){
  db.collection("sensorData").insert(data);
  return callback();
  db.close();
}
module.exports.fetchData = function(callback){
  db.collection("sensorData").find({},{_id:0}).toArray(function(err, result) {
    if (err) throw err;
    return callback(err, result.length);
    db.close();
  });
}
