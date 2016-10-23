var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var sessions = require('./routes/sessions');

var session = require('express-session');
var NedbStore = require('connect-nedb-session')(session)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
  var contentType = req.headers['content-type'] || ''
    , mime = contentType.split(';')[0];
  if (mime != 'text/plain') {
    return next();
  }
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  req.on('end', function() {
    req.rawBody = new Buffer(req.rawBody.toString('binary'),'binary');
    next();
  });
});

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'llop,cnhr9om',
  resave: false,
  saveUninitialized: true,
  store: new NedbStore({
    filename: path.join(__dirname, 'session.nedb')
  })
}));

var checkAuth = express.Router();
checkAuth.use(function(req, res, next) {
  if (req.method === 'GET' && req.url.match(/^\/[a-zA-Z0-9]$/)) {
    return next()
  }
  if (typeof req.session.currentUser === 'undefined')
    return res.redirect(`/login?path=${encodeURI(req.url)}`);
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/posts', checkAuth, posts);
app.use('/sessions', sessions);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error(`Not Found ${req.path}`);
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
