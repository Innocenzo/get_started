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

//
//   router.post("/contacts", function(req, res) {
//     console.log("routes");
//     console.log(req.body);
//     models.Contact.create({
//         name: req.body.text,
//         surname: req.body.text,
//         tel: req.body.text
//     }).then(function(contacts){
//         res.json(contacts.dataValues);
//     }).catch(function(error){
//         console.log("ops: " + error);
//         res.status(500).json({ error: 'error' });
//     });
//     });
//
// });
module.exports = router;
