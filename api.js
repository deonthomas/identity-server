//packages
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
//var config = require('./config/config.js');

//modules
var User = require('./model/User.js');
var jwt = require('./services/jwt.js');
var app = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header('Acess-Control-Allow-Origin', '*');
  res.header('Acess-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorozation');
    
    if(!req.headers.authorization){
        return res.status(401).send({message:"You are not authorized"})
    }
    
    var payload =  jwt.decode(req.headers.authorization,"secret");
    console.log("payload:" +  payload.toString());
    if(!payload.sub){
        res.status(401).send({message:"Authentication failed no issuer."});
    }
    next();
});




mongoose.Promise = global.Promise;

app.post('/register', function(req, res) {
  var user = req.body;
  var newUser = new User.model({
    name: user.name,
    password: user.password,
    email: user.email
  });

  var payload = {
    iss: req.hostname,
    sub: newUser.id,
  }

  //get the auth token
  var token = jwt.encode(payload, "secret");

  var promise = newUser.save()
  promise.then(function(doc) {
    res.status(200).send({
      user: newUser.toJSON(),
      token: token
    });
  });
});

app.post('/login', function(req, res) {
  res.send("login");
});

app.post('/logout', function(req, res) {
  res.send("logout");
});

app.post('/forgot-password', function(req, res) {
  res.send("forgot-password");
});

console.log(jwt.encode('hi', 'secret'));

mongoose.connect('mongodb://localhost/identityDb');

var server = app.listen(3000, function() {
  console.log('api listening on ', server.address().port);
});
