var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json());

app.use(function(req,res,next){
  res.header('Acess-Control-Allow-Origin','*');
  res.header('Acess-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Acess-Control-Allow-Headers','Content-Type, Authorozation');
  next();
});

mongoose.Promise = global.Promise ;

var User = mongoose.model('User',{
  name:String,
  password:String,
  email:String
});


app.post('/register', function(req, res){
  var user = req.body;

  console.log(user);
  var newUser = new User({
    name: user.name,
    password: user.password,
    email: user.email
  })

  var promise = newUser.save()
promise.then(function(doc){
  res.status(200).json(newUser);
});
});

app.post('/login', function(req, res){
  res.send("login");
});

app.post('/logout', function(req, res){
  res.send("logout");
});

app.post('/forgot-password', function(req, res){
  res.send("forgot-password");
});

mongoose.connect('mongodb://localhost/identityDb');

var server = app.listen(3000,function(){
  console.log('api listening on ', server.address().port);
});
