var models  = require('./models');
var express = require("express");
var passport = require("passport");
var bcrypt = require("bcrypt-nodejs");

var SALT_FACTOR = 10;


var router = express.Router();

router.get("/api/contacts", function(req, res) {
  models.Contact.findAll().then(function(contacts){
    res.json(contacts);
  });
});

router.post("/api/contacts", function(req, res) {
  // console.log("routes");
  models.Contact.create({
    name: req.body.name1,
    surname: req.body.surname,
    tel: req.body.tel
  }).then(function(contact){
    console.log(req.body+"hhfhjfjhfhjfhfhj");
    console.log(contact.dataValues);
    res.json(contact);
  }).catch(function(error){
    console.log("ops: " + error);
    res.status(500).json({ error: 'error' });
  });
});

router.put("/api/contacts/:id", function(req, res) {
  console.log("put");
  console.log(req.params.id);
  models.Contact.findById(req.params.id).then(function(contact) {
    var prop;
     for(prop in req.body){
          contact[prop]=req.body[prop];
          console.log(prop+"      "+req.body[prop]);

     }
     console.log(contact.dataValues);
     contact.save().then(function(contact){
       res.json(contact);
     }).catch(function(error){
       console.log("ops: " + error);
       res.status(500).json({ error: 'error' });
     });
});
});

router.delete("/api/contacts/:id", function(req, res) {
  console.log("delete");
  console.log(req.params.id);
  models.Contact.findById(req.params.id).then(function(contact) {
     console.log(contact);
     contact.destroy().then(function(contact){
       res.send('DELETE');
     }).catch(function(error){
       console.log("ops: " + error);
       res.status(500).json({ error: 'error' });
     });
});
});

router.get("/logout", function(req, res) {
req.logout();
res.redirect("/");
});


router.post("/api/login", function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.json(user.username+"  "+ user.uuid);
      // return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});

router.post("/api/signup", function(req, res) {
  console.log(req.body.username);
  models.User.findOne({where:{ username: req.body.username }}).then(function(user) {
             console.log(user);
             if (user) {
              //  res.json({ error: 'User already exists' });
                 req.flash("error", "User already exists");
                 return res.redirect("/signup");
             }

             var noop = function() {};
             bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
                if (err) { return done(err); }
                bcrypt.hash(req.body.password, salt, noop, function(err, hashedPassword) {
                if (err) { return err; }
                var password = hashedPassword;
                models.User.create({
                  username: req.body.username,
                  password: password
                }).then(function(contact){
                  console.log(req.body);
                  // console.log(contact.dataValues);
                  res.json(contact);
                }).catch(function(error){
                  console.log("ops2: " + error);
                  res.status(500).json({ error: 'error' });
                });
                //done();
                });
                });


     }).catch(function(error){
       console.log("ops1: " + error);
       res.status(500).json({ error: 'error' });
     });

}, passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/signup",
  failureFlash: true
}));
module.exports = router;