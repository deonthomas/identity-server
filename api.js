//packages
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
//var config = require('./config/config.js');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//modules
var User = require('./model/User.js');
var jwt = require('./services/jwt.js');
var app = express();
var strategyOption = {
                        usernameField: 'email',
                        passwordField: 'password'
                     };

mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


app.use(function (req, res, next) {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Acess-Control-Allow-Headers', 'Content-Type, Authorozation');

    if (!req.headers.authorization) {
        return res.status(401).send({message: "You are not authorized"})
    }

//    var payload = jwt.decode(req.headers.authorization, "secret");
//    console.log("payload:" + payload.toString());
//    if (!payload.sub) {
//        res.status(401).send({message: "Authentication failed no issuer."});
//    }
    next();
});


//setup passport register strategy
var registerStrategy = new LocalStrategy(strategyOption, function (userEmail, password, done) {

    var newUser = new User({
        password: password,
        email: userEmail
    });
    
    console.log(newUser);

    var promise = newUser.save();
    done(null, newUser);
});


//setup passport login strategy
var loginStrategy = new LocalStrategy(strategyOption, function (userEmail, password, done) {
    var searchUser = {email: userEmail};
    User.findOne(searchUser, function (err, user) {
        if (err) return done(err);

        if (!user) {
            return done(null, false, {message: "User not found or wrong email or password"});
        }

        user.comparePasswords(password, function (err, isMatch) {
            if (err) return done(err);

            if (!isMatch) {
                return done(null, false, {message: "wrong email or password"});
            }
            return done(null, user);
        });
    });
});

passport.use('local-register', registerStrategy);
passport.use('local-login', loginStrategy);


app.post('/register', passport.authenticate('local-register'), function (req, res) {
    createSendToken(req.user, res);
});

app.post('/login', passport.authenticate('local-login'), function (req, res) {
    createSendToken(req.user, res);
});

function createSendToken(user, res) {
    var payload = {
        sub: user.id
    };

    //get the auth token
    var token = jwt.encode(payload, "secret");
    res.status(200).send({
        user: user.toJSON(),
        token: token
    });
}

app.post('/logout', function (req, res) {
    res.send("logout");
});

app.post('/forgot-password', function (req, res) {
    res.send("forgot-password");
});

mongoose.connect('mongodb://localhost/identityDb');

var server = app.listen(3000, function () {
    console.log('api listening on ', server.address().port);
});
