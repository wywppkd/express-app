var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rfs = require("rotating-file-stream");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// 配置ejs模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());// express4.16.0之后版本内置了body-parser
app.use(express.urlencoded({ extended: false }));// express4.16.0之后版本内置了body-parser
app.use(cookieParser());// 将cookie解析为键值对

// 将日志写入log目录文件中
// 设置date为当前时区的时间
logger.token('date', function() {
  var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
  return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});
var accessLogStream = rfs.createStream("access.log", {
  size: "10M", // 每10M大小轮换
  interval: "1d", // 每天轮换
  path: path.join(__dirname, "log")
});
app.use(logger("combined", { stream: accessLogStream }));

app.use('/static', express.static(path.join(__dirname, 'public')));// 静态文件中间件
app.use('/', indexRouter);// index路由
app.use('/users', usersRouter);// users路由

// 404错误
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理中间件
app.use(function(err, req, res, next) {
  // 仅在开发中提示错误
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 错误页面
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
