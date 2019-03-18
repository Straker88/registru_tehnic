var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'clarfontehnic';
bodyParser = require("body-parser");
var express = require('express');
var LocalStrategy = require('passport-local');
var path = require('path');
var cookieParser = require('cookie-parser');

module.exports = function (app, passport) {

    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session({
        secret: 'tehnic',
        resave: false,
        saveUninitialized: true,
        rolling: true,
        cookie: { httpOnly: true, maxAge: 28800000 }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        if (user) {
            if (user.error) {
                token = 'unconfirmed/error';
            } else {
                token = user._id;
            }
        } else {
            token = 'inactive/error';
        }
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use('local', new LocalStrategy(
        function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    return done(err);
                }
                else {
                    return done(null, user);
                }
            });
        }

    ));


    return passport;
};
