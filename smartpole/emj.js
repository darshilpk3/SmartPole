function convertToJSONDate(strDate){
    var dt = new Date(strDate);
    var newDate = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    console.log('/Date(' + newDate.getTime() + ')/';);
}

// testing


/*
function xyz(i){
  Q.fcall(function(){
    var xyz = convertToJSONDate("01" + "May" + "2017");
    var pqr = convertToJSONDate("01" + "Apr" + "2017");
    console.log(xyz);
    console.log(pqr);
      return db.collection("sensorData").find({'Result.SensorID':+id}).toArray();
  }).then(function(arr1){
      console.log(arr1 + "this time");
      console.log("1");
      return arr1;
  }).then(function(abac){
    i=i+1;
    console.log("2");
    console.log(i);
    if(i<end_mon)
    {
      xyz(i);
    }
  }
);
}
xyz(start_mon);
*/
