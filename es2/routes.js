var models  = require('./models');
var express = require("express");

// var User = require("./models/user");
var router = express.Router();

// router.get("/", function(req, res) {
//   res.render('index', {
//       title : 'es2'
//   });
//   });
router.get("/api/contacts", function(req, res) {
  models.Contact.findAll().then(function(contacts){
    res.json(contacts);
  });
});

router.post("/api/contacts", function(req, res) {
  // console.log("routes");
  console.log(req.body+"hhfhjfjhfhjfhfhj");
  console.log(req.body.name1+"nome");
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


module.exports = router;
