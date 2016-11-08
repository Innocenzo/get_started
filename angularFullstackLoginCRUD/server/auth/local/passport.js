var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        where: {
          email: email.toLowerCase()
        }
      }).then(function(user) {
        if (!user) {
           done(null, false, { message: 'This email is not registered.' });
        }
        if (!user.authenticate(password)) {
           done(null, false, { message: 'This password is not correct.' });
        }
         done(null, user);
      })
      .catch(function(err) {
        done(err);
      });
    }
  ));
};