var express = require ('express');
var app = express();
var bodyParser = require ('body-parser');
var mongoose = require('mongoose');
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
Sensor = require('./routes/sensors');
Gateway = require('./routes/gateways');
Data = require('./routes/data');
var morgan = require('morgan');
var jwt    = require('jsonwebtoken');
var User   = require('./models/user');

mongoose.connect('mongodb://localhost/smartpole');
var db = mongoose.connection;
app.use(morgan('dev'));
app.set('superSecret', "krishmehta");
////////////////////////////////////////////////////////////////////////
app.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, message: 'Please pass name and password.'});
  } else {
    User.findOne({
      name: req.body.name
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        var newUser = new User({
          name: req.body.name,
          password: req.body.password
        });
        newUser.save(function(err) {
          if (err) {
            return res.json({success: false, message: 'Username already exists.'});
          }
          res.json({success: true, message: 'Successful created new user.'});
        });
      } else if (user) {
        return res.json({success: false, message: 'Error in Inserting'});
      }
    }
  )};
});


app.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      /*if (user.password != req.body.password) {
      res.json({ success: false, message: 'Authentication failed. Wrong password.' });*/
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user, app.get('superSecret'), {
            //expiresIn: 1440 // expires in 24 hours
          });
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        } else {
          res.send({success: false, message: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});


///////////////////////////////////////////////////////////////////////

//adding data to mongodb

app.post('/data', function(req,res){
  var data = req.body;
  Data.pushData(data, function(err, data){
    if(err){
      throw err;
    }
    res.json(data);
  });
});

app.get('/data', function(req,res){
  Data.fetchData(function(err, data){
    if(err){
      throw err;
    }
    res.json(data);
  });
});


app.get('/',function(req,res){
  res.send('Please use /sensors');
});


//get sensor details (w/o data)

app.get('/sensors', function(req,res){
  Sensor.getSensorDetails(function(err, sensors){
    if(err){
      throw err;
    }
    res.json(sensors);
  });
});

app.get('/sensors/:id', function(req,res){
  var id = req.params.id
  Sensor.getSensorDetailsById(id,function(err, sensors){
    if(err){
      throw err;
    }
    res.json(sensors);
  });
});


// get gateway details

app.get('/gateways', function(req,res){
  Gateway.getGateways(function(err, gateways){
    if(err){
      throw err;
    }
    res.json(gateways);
  });
});

//history and recent data of sensor based on paramater

app.get('/sensorsdata/:_id/:type', function(req,res){

  console.log(req.params.type);

  if(req.params.type == "recent"){
    Sensor.getRecentDataById(req.params._id, function(err, data){
      if(err){
        throw err;
      }
      res.json(data);
    });
  }
  else if(req.params.type == "history" || req.params.type == "undefined"){
    Sensor.getHistoryDataById(req.params._id, function(err, data){
      if(err){
        throw err;
      }
      res.json(data);
    });
  }
});

//get details of sensor btw 2 given dates
app.get('/sensorsdata/:_id/history/:todate/:fromdate',function(req,res) {
  //console.log(req.params.todate);
  Sensor.getHistoryDate(req.params._id,req.params.todate,req.params.fromdate,function(err, data){

    if(err){
      throw err;
    }
    res.json(data);
  });
});

//sensor details like last data reading, plot value , battery , gateway id

app.get('/sensorsdata/:_id', function(req,res){
  Sensor.getRecentDataById(req.params._id, function(err, data){
    if(err){
      throw err;
    }
    res.json(data);
  });
});

// get the data of the gateway by id

app.get('/gateways/:_id', function(req,res){
  Gateway.getGatewayDataById(req.params._id, function(err, data){
    if(err){
      throw err;
    }
    res.json(data);
  });
});

// delete the data of the gateway by id

app.delete('/gateways/:_id', function(req,res){
  Gateway.deleteGateway(req.params._id, function(err, data){
    if(err){
      throw err;
    }
    res.send("success");
  });
});

// add the gateways

app.post('/gateways', function(req,res){
  var gateway = req.body;
  Gateway.addGateway(gateway, function(err, gateways){
    if(err){
      throw err;
    }
    res.json(gateways);
  });
});

// update gateway info

app.put('/gateways/:id', function(req,res){
  var id = req.params.id
  var gateway = req.body;
  Gateway.updateGateway(id, gateway, function(err, gateways){
    if(err){
      throw err;
    }
    res.send("success");
  });
});


//Adding a sensor

app.post('/sensors', function(req,res){
  var sensor = req.body;
  Sensor.addSensor(sensor, function(err, sensors){
    if(err){
      throw err;
    }
    res.json(sensors);
  });
});


// deleting a sensor based on ID

app.delete('/sensors/:id', function(req,res){
  var id = req.params.id

  Sensor.deleteSensor(id, function(err, sensors){
    if(err){
      throw err;
    }
    res.json(sensors);
  });
});

//Search Sensors by sensor type

app.get('/sensors/search/:type', function(req,res){
  var type = req.params.type
  Sensor.getSensorDetailsByType(type,function(err, sensors){
    if(err){
      throw err;
    }
    res.json(sensors);
  });
});


//updating sensor based on ID

app.put('/sensors/:id', function(req,res){
  var id = req.params.id
  var sensor = req.body;
  Sensor.updateSensor(id, sensor, function(err, sensors){
    if(err){
      throw err;
    }
    res.send("success");
  });
});


app.listen(4000);
console.log('Running on port 4000...');
