var models  = require('./models');
var express = require("express");
var passport = require("passport");
var bcrypt = require("bcrypt-nodejs");

var SALT_FACTOR = 10;


var router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('is usercurrent');
    // res.status(200).json({ err: 'authorized' });
    next();
  } else {
    console.log('Unauthorized');
    res.status(401).json({ err: 'Unauthorized' });
  }
}

router.use(function(req, res, next) {
  // console.log(req.user);
  if (req.user) {
    console.log(req.user.username);
  }
  if (req.isAuthenticated()) {
    console.log('is usercurrent');

  }
  console.log('middleware');
  next();
});

router.get("/api/contacts/:id",ensureAuthenticated, function(req, res) {
  if (req.params.id==req.user.uuid) {
    if(req.user){
      console.log(req.user.username,'currentUser list contacts');}
      console.log(req.params.id);
      models.Contact.findAll({where:{ uuid: req.params.id }}).then(function(contacts) {
        res.json(contacts);
      }).catch(function(error){
        console.log("ops: " + error);
        res.status(500).json({ error: 'error' });
      });
    } else {
      console.log('Unauthorized');
      res.status(401).json({ err: 'Unauthorized' });
    }

  });

  router.post("/api/contacts/:uuid",ensureAuthenticated, function(req, res) {
    console.log("add contact");
    console.log(req.body.uuid);
    if (req.params.uuid==req.user.uuid) {
      models.Contact.create({
        name: req.body.name1,
        surname: req.body.surname,
        tel: req.body.tel,
        uuid: req.body.uuid
      }).then(function(contact){
        console.log(req.body+"hhfhjfjhfhjfhfhj");
        console.log(contact.dataValues);
        res.json(contact);
      }).catch(function(error){
        console.log("ops: " + error);
        res.status(500).json({ error: 'error' });
      });
    } else {
      console.log('Unauthorized');
      res.status(401).json({ err: 'Unauthorized' });
    }
  });

  router.put("/api/contacts/:id/:uuid",ensureAuthenticated, function(req, res) {
    console.log("put");
    console.log(req.params.id);
    if (req.params.uuid==req.user.uuid) {
      models.Contact.findById(req.params.id).then(function(contact) {
        var prop;
        for(prop in req.body){
          contact[prop]=req.body[prop];
          console.log(prop+"      "+req.body[prop]);
        }
        console.log(contact.dataValues);
        contact.save().then(function(contact){
          console.log("Update");
          res.json(contact);
        }).catch(function(error){
          console.log("ops: " + error);
          res.status(500).json({ error: 'error' });
        });
      });
    } else {
      console.log('Unauthorized');
      res.status(401).json({ err: 'Unauthorized' });
    }
  });

  router.delete("/api/contacts/:id/:uuid",ensureAuthenticated, function(req, res) {
    console.log("delete");
    console.log(req.params.id);
    if (req.params.uuid==req.user.uuid) {
      models.Contact.findById(req.params.id).then(function(contact) {
        console.log(contact);
        contact.destroy().then(function(contact){
          console.log('delete');
          res.send('DELETE');
        }).catch(function(error){
          console.log("ops: " + error);
          res.status(500).json({ error: 'error' });
        });
      });
    } else {
      console.log('Unauthorized');
      res.status(401).json({ err: 'Unauthorized' });
    }
  });

  router.get("/api/logout",ensureAuthenticated, function(req, res) {
    console.log('ok');
    req.logout();
    res.status(200).end("logout");
  });


  router.post("/api/login", function(req, res, next) {
    console.log('one');
    passport.authenticate('login', function(err, user, info) {
      console.log('two');
      if (err) {
        console.log('err1',err);
        return next(err); }
        if (!user) {
          console.log('err2',err);
          return res.redirect('/login'); }
          console.log(user+"login");
          req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.json(user);
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
                console.log(req.body,'signup');
                // console.log(contact.dataValues);
                res.status(200).end("signup");
                // return;
              }).catch(function(error){
                console.log("ops: " + error);
                res.status(500).json({ error: 'error' });
              });
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
