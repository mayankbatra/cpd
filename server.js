var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);

var routes = require('./server/routes/index');


// Connect to the database on local mongo DB. No uername and password
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cpd');


var app = express();

// view engine setup
//USing Jade instead of HTML
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'jade');

//INitializing Express libraries as middleware
//For requesy post params, url route matching and cookie reading
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//To server static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

//To manage sessions inside mongo itself
app.use(expressSession({
    key: 'session',
    resave: false,
    saveUninitialized: true,
    secret: 'COUPONDUNIA',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Adding Routes to the app
app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

module.exports = app;