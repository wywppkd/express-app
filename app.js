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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 将日志写入log目录文件中
var accessLogStream = rfs.createStream("access.log", {
  size: "10M", // 每10M大小轮换
  interval: "1d", // 每天轮换
  path: path.join(__dirname, "log")
});
app.use(logger("combined", { stream: accessLogStream }));

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
