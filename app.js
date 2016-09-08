var express = require('express');
var port = process.env.PORT || 3000;
var path = require('path');
var mongoose = require('mongoose');
var logger = require('morgan');
var app = express();
var bodyParser = require('body-parser')

var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session);

var dbUrl = 'mongodb://localhost/node_movie'
mongoose.connect(dbUrl);

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({    
   secret: 'imovie',    
   store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
   }),
   resave: false,    
   saveUninitialized: false
}));
app.use(express.static(path.join(__dirname,'public')));
app.locals.moment = require('moment');

if('development' === app.get('env')){
    app.set('showStackError',true);
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug',true);
}
require('./config/routes')(app)

app.listen(port);

console.log('started at !!' + port);