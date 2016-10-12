var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt-nodejs");
var models = require("./models");




module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user.uuid);
  });

  passport.deserializeUser(function(id, done) {
    models.User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use("login", new LocalStrategy(function(username, password, done) {
    console.log(username+password);
    models.User.findOne({where:{ username: username }}).then(function(user) {
              var checkPassword = function(guess, done) {
                console.log(guess +"User.checkPassword"+"   "+user.dataValues.password);
                bcrypt.compare(guess, user.dataValues.password, function(err, isMatch) {
                  done(err, isMatch);
                  console.log(isMatch+"123");
                });
              };
              //  console.log(user);
               if (!user) {
                 return done(null, false, { message: "No user has that username!" });
               }
               console.log(password);
               checkPassword(password, function(err, isMatch) {
                 console.log(isMatch);
                 if (err) { return done(err); }
                 if (isMatch) {
                   console.log('isMatch' +"8");
                  //  console.log(user);
                   return done(null, user);
                 } else {
                   return done(null, false, { message: "Invalid password." });
                 }
               });
       }).catch(function(error){
         console.log("ops1: " + error);
         res.status(500).json({ error: 'error' });
       });
    // models.User.findOne({where:{ username: username }}, function(err, user) {
    //   console.log("login");
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: "No user has that username!" });
    //   }
    //   models.User.checkPassword(password, function(err, isMatch) {
    //     if (err) { return done(err); }
    //     if (isMatch) {
    //       return done(null, user);
    //     } else {
    //       return done(null, false, { message: "Invalid password." });
    //     }
    //   });
    // });
  }));

};
