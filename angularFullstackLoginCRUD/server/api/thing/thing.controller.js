/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sqldb  = require('../../sqldb');
var Thing = sqldb.Thing;

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy().then(function() {
        res.status(204).end();
      });
    }
  }
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  }
}

function tailThings(req) {
  return function (things) {
    return _.tail(things);
  }
}

function respondWithResult(res, statusCode) { // NOTE: funzione per passare i parametri necessari
  statusCode = statusCode || 200; // NOTE: in caso di secondo parametro undefine ritorno 200
  return function(entity) { // NOTE: callback della then
    res.status(statusCode).json(entity);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) { // NOTE: callback della catch
     res.status(statusCode).json(err);
  }
}

// Get list of things
exports.index = function(req, res) {

    // Thing.findAll()
    // // .then(tailThings(req))
    // // .then(function(req) {
    // //   return _.tail(req);
    // // })
    // // .then(function(response) {
    // //   res.json(response);
    // // })
    // // elimina il primo obj
    // .then(respondWithResult(res, 200))
    // .catch(handleError(res));
    console.log('findAll');
    Thing.findAll({
      where: {
        id_user: req.user.dataValues._id
      }
    }).then(function(things) {
      // console.log(things,'things show');
      if(!things) { return res.status(404).send('Not Found'); }
        res.json(things);
    })
    .catch(handleError(res));

};

// Get a multiple thing
exports.show = function(req, res) {

console.log(req.user.dataValues);
  Thing.findAll({
    where: {
      id_user: req.user.dataValues.id_user
    }
  }).then(function(things) {
    // console.log(things,'things show');
    if(!things) { return res.status(404).send('Not Found'); }
    return res.json(things);
  })
  .catch(handleError(res));
  // Thing.findById(req.params.email, function (err, thing) {
  //   if(err) { return handleError(res, err); }
  //   if(!thing) { return res.status(404).send('Not Found'); }
  //   return res.json(thing);
  // });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  req.body.id_user=req.user.dataValues._id;
  Thing.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  console.log(req.params.id,'update',req.body);
  if(req.body._id) { delete req.body._id; }
   Thing.findById(req.params.id)
  .then(function(thing) {
    if(!thing) { return res.status(404).send('Not Found'); }
    var updated = _.merge(thing, req.body);
    return updated.save();
  })
  .then(function(thing) {
     res.status(200).json(thing);
  })
  .catch(handleError(res));
  // Thing.findById(req.params.id, function (err, thing) {
  //   if (err) { return handleError(res, err); }
  //   if(!thing) { return res.status(404).send('Not Found'); }
  //   var updated = _.merge(thing, req.body);
  //   updated.save(function (err) {
  //     if (err) { return handleError(res, err); }
  //     return res.status(200).json(thing);
  //   });
  // });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
