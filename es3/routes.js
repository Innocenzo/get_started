var models  = require('./models');
var express = require("express");

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


module.exports = router;
