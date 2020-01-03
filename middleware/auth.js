module.exports = function(req, res, next) {
  console.log("TCL: req.app", req.app.get("env"));
  const whiteUrls = ["/user/login"]; // 登录白名单

  if (req.session.user || whiteUrls.includes(req.path)) {
    next();
  } else {
    res.redirect("/user/login");
  }
};
