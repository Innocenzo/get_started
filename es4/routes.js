var models  = require('./models');
var express = require("express");

var router = express.Router();

router.post("/api/msg", function(req, res) {
  console.log("save msg");
  console.log(req.body);

    models.Message.create(req.body).then(function(msg){
      console.log(msg.dataValues);
      res.json(msg);
    }).catch(function(error){
      console.log("ops: " + error);
      res.status(500).json({ error: 'error' });
    });

});

module.exports = router;
