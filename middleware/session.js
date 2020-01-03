var session = require("express-session");

module.exports = session({
  name: "sessionId",
  secret: "oolp",
  resave: false,
  rolling: true, // session过期时间刷新
  saveUninitialized: true, // false:只有修改req.session对象才会生成会话
  cookie: {
    maxAge: 10 * 60 * 60 * 1000
  }
});
