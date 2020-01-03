var createError = require("http-errors");
var express = require("express");
var path = require("path");
var session = require("./middleware/session");
var auth = require("./middleware/auth");
var logger = require("./middleware/logger");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");

var app = express();

// 配置ejs模板引擎
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 解析请求体参数
app.use(express.json()); // express4.16.0之后版本内置了body-parser
app.use(express.urlencoded({ extended: false })); // express4.16.0之后版本内置了body-parser

// 中间件
app.use(session); // 生成session会话
app.use(logger); // 日志
app.use(express.static(path.join(__dirname, "public"))); // 静态文件中间件
app.use("/", auth); // 检测登录状态

// 路由层中间件
app.use("/", indexRouter); // index路由
app.use("/user", usersRouter); // user路由

// 404错误
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理中间件
app.use(function(err, req, res, next) {
  // 仅在开发中提示错误
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // 错误页面
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
