var models  = require('./models');
var express = require("express");

// var User = require("./models/user");
var router = express.Router();


router.get("/", function(req, res, next) {
  // models.Contact.findAll().then(function(contacts){
  //     res.json(contacts);
  // });
  res.render("index");
  // User.find()
  // .sort({ createdAt: "descending" })
  // .exec(function(err, users) {
  //   if (err) { return next(err); }
  //   res.render("index", { users: users });
  // });
});

// router.get("/login", function(req, res) {
//   res.render("login");
// });
//
// router.post("/login", passport.authenticate("login", {
//   successRedirect: "/",
//   failureRedirect: "/login",
//   failureFlash: true
// }));
//
// router.get("/logout", function(req, res) {
//   req.logout();
//   res.redirect("/");
// });
//
// router.get("/signup", function(req, res) {
//   res.render("signup");
// });
//
// router.post("/signup", function(req, res, next) {
//
//   var username = req.body.username;
//   var password = req.body.password;
//
//   // User.findOne({ username: username }, function(err, user) {
//   //
//   //   if (err) { return next(err); }
//   //   if (user) {
//   //     req.flash("error", "User already exists");
//   //     return res.redirect("/signup");
//   //   }
//
//     var newUser = new User({
//       username: username,
//       password: password
//     });
//     // newUser.save(next);
//
//   // });
// });
//
// router.get("/users/:username", function(req, res, next) {
//   // User.findOne({ username: req.params.username }, function(err, user) {
//   //   if (err) { return next(err); }
//   //   if (!user) { return next(404); }
//   //   res.render("profile", { user: user });
//   // });
// });
//
// router.get("/edit", ensureAuthenticated, function(req, res) {
//   res.render("edit");
// });
//
// router.post("/edit", ensureAuthenticated, function(req, res, next) {
//   req.user.displayName = req.body.displayname;
//   req.user.bio = req.body.bio;
//   req.user.save(function(err) {
//     if (err) {
//       next(err);
//       return;
//     }
//     // req.flash("info", "Profile updated!");
//     res.redirect("/edit");
//   });
// });

module.exports = router;
