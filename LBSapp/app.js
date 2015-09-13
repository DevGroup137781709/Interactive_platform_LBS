var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var formidable = require('formidable');//ʹ���м�� ,�����ϴ��ļ�
var bodyParser = require('body-parser');
var session = require('express-session'); //���Ҫʹ��session����Ҫ�����������ģ��


//·������
var routes = require('./routes/index');
var users = require('./routes/users');
var register =require('./routes/register');
var login =require('./routes/login');
var uesrsControl =require('./routes/user/usersControl');
var partyControl =require('./routes/party/partyControl');
var map =require('./routes/map');
var test =require('./routes/test');
//·������
var app = express();
var ejs = require('ejs');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'qianzise',cookie: { maxAge: 600*1000}}));
app.use('/', routes);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/user/', uesrsControl);
app.use('/party/', partyControl);
app.use('/map', map);
app.use('/test', test);

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
