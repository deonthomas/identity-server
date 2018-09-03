var moment = require('moment');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./model/User.js');

var app = express();
app.use(bodyParser.json());
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
        res.status(200).json(newUser);
    });
});

app.post('/login', function (req, res) {
    console.log(req.body);
    res.send("loging");
});

app.post('/logout', function (req, res) {
    console.log(req.body);
    res.send("logout");
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
})



