var moment = require('moment');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./model/User.js');

var jwt = require('jwt-simple');
var passport = require('passport')
//var localStrategy = require('passport-local')

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

mongoose.connect('mongodb://localhost/psjwt');

app.use(function (req, res, next) {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorozation');
    next();
});


app.post('/register', function (req, res) {
    
    var user = req.body;
    var newUser = new User.model({
        name: user.name,
        surname: user.surname,
        cell: user.cell,
        email: user.email,
        password:user.password
    });

    newUser.save(function(err){
       createToken(newUser, res);
    });
});

app.post('/login', function (req, res) {
console.log(req.body);
 var user = req.body;

 var searchUser = { email: req.user.email};
    User.findOne({ email:user.email },function(err, user){
      if(err) throw err;  

      if(!user)
        return res.status(401).send({message: "Wrong email/password"});

       user.comparePasswords(req.user.password, function(err,isMatch ){
            if(err) throw err;

            if(!isMatch)
               return res.status(401).send({message: "Wrong email/password"});
            
            createToken(user,res);
      });
    });
});

function createToken(user, res){
    var payload = {
        iss:req.hostname,
        sub: user._id
    }
    var token = jwt.encode(payload,"shhh..")
}

app.post('/logout', function (req, res) {
   
});

app.post('/reset-password', function (req, res) {
    console.log(req.body);
    res.send("reset password");
});

app.post('/verify-email', function (req, res) {
    console.log(req.body);
    res.send("verify email");
});


app.get('/test', function (req, res) {
    console.log(req.body);
    res.send("test link");
});


var server = app.listen(3000,function(){
    console.log("Listening on port", server.address().port)
});