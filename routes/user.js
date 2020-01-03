var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router
  .get("/login", function(req, res, next) {
    res.render("login");
  })
  .post("/login", function(req, res, next) {
    if (req.body.user === "admin" && req.body.password === "123456") {
      req.session.user = req.body.user;
      res.redirect("/");
    } else {
      let error = req.body.user !== "admin" ? "账号错误" : "密码错误";
      res.render("login", { error: error });
    }
  });

router.post("/logout", function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      next(err);
    }

    res
      .send({
        code: "0000",
        msg: "退出登录成功"
      })
      .json();
  });
});

module.exports = router;
