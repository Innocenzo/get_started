'use strict';

var User = require('../../sqldb').User;
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

function validationErr(res,statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  return User.findAll({
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider'
    ]
  }).then(function(users) {
     res.status(200).json(users);
  })
  .catch(handleError(res));
  // User.find({}, '-salt -hashedPassword', function (err, users) {
  //   if(err) return res.status(500).send(err);
  //   res.status(200).json(users);
  // });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = User.build(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  return newUser.save()
  .then(function(user) {
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  })
  .catch(validationErr(res));
  // (function(err, user) {
  //   if (err) return validationError(res, err);
  //   var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
  //   res.json({ token: token });
  // });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  return User.findById(userId).then(function(user) {
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  })
  .catch(function(err) {
    return next(err);
  });
  // User.findById(userId, function (err, user) {
  //   if (err) return next(err);
  //   if (!user) return res.status(401).send('Unauthorized');
  //   res.json(user.profile);
  // });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);
  console.log('change password model');
     User.findById(userId).then(function(user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save()
      .then(function() {
        console.log('save ok');
         res.status(200).send('save ok');
      })
      .catch(function(err) {
        return validationError(res, err);
      });
      // user.save(function(err) {
      //   if (err) return validationError(res, err);
      //   res.status(200).send('OK');
      // });

    } else {
      res.status(403).send('Forbidden');
    }
  })
  .catch(validationErr(res));
  // User.findById(userId, function (err, user) {
  //   if(user.authenticate(oldPass)) {
  //     user.password = newPass;
  //     user.save(function(err) {
  //       if (err) return validationError(res, err);
  //       res.status(200).send('OK');
  //     });
  //   } else {
  //     res.status(403).send('Forbidden');
  //   }
  // });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  console.log('user');
  var userId = req.user._id;
  console.log(userId,'userId');
  User.findById(userId,{
  attributes: [
    '_id',
    'name',
    'email',
    'role',
    'provider'
  ]}).then(function(user) {
    // console.log(user.dataValues.name);
    if (!user) return res.status(401).send('Unauthorized').end();
      res.json(user);
  })
  .catch(function(err) {
    return next(err);
  });
//   User.findOne({
//     where: {
//     _id: userId
//   }
// }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
//     console.log(user);
//     if (err) return next(err);
//     if (!user) return res.status(401).send('Unauthorized');
//     res.json(user);
//   });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
