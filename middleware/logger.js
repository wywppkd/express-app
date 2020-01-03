var path = require("path");
var logger = require("morgan");
var rfs = require("rotating-file-stream");

// 将日志写入log目录文件中
// 设置date为当前时区的时间
logger.token("date", function() {
  var p = new Date()
    .toString()
    .replace(/[A-Z]{3}\+/, "+")
    .split(/ /);
  return p[2] + "/" + p[1] + "/" + p[3] + ":" + p[4] + " " + p[5];
});
var accessLogStream = rfs.createStream("access.log", {
  size: "10M", // 每10M大小轮换
  interval: "1d", // 每天轮换
  path: path.join(__dirname, "../log")
});

module.exports = logger("combined", { stream: accessLogStream });
