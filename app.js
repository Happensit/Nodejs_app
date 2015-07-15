var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    flash = require('express-flash'),
    moment = require('moment'),
    session = require('express-session'),
    swig = require('swig'),
    passport = require('passport'),
    csrf = require('csurf');

// Config
var cryptoKey = '15jk3yb0ardc4t';
global.__approot = __dirname;

var routes = require('./app/routes/index');
var users = require('./app/routes/users');

var app = express();

/* view engine setup */
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false); // To disable Swig's cache, do the following:
swig.setDefaults({ cache: false }); // Don't leave both of these to `false` in production!

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cryptoKey));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: cryptoKey,
    cookie: { maxAge: 120000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({ cookie: { signed: true } }));

/* Set custom header */
app.use(function (req, res, next) {
    res.setHeader('X-Powered-By', 'Happensit Nodejs Framework');
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    res.locals.user = {};
    //res.locals.user.id = req.user && req.user.id;
    next();
});

/* Messages */
app.use(flash());
var add_flash = require('add-flash');
app.use(add_flash());

/* Locals varables */

/* Dates */
moment.locale('ru');
app.locals.moment = moment;

/* Copyright */
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = "SelimVas.ru";



/* Routes */
app.use('/', routes);
app.use('/user', users);

app.get('/post/:slug', function(req, res, next){
    res.locals.posts.forEach(function(post){
        if (req.params.slug === post.slug){
            res.render('post.ejs', { post: post });
        }
    })
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
