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
    console.log("TCL: req.body", req.body);
    if (req.body.user === "admin" && req.body.password === "123456") {
      req.session.user = req.body.user;
      res.redirect("/");
    } else {
      res.send("login fail");
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
