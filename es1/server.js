// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                   // create our app w/ express
    var morgan   = require('morgan');             // log requests to the console (express4)
    var path     = require("path");

    // configuration =================

    app.use(express.static(path.resolve(__dirname, "public")));     // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console

    // application -------------------------------------------------------------
    // app.get("/olivia", function(request, response) {
    //   response.send("Welcome to Olivia’s homepage!");
    // });

    app.use(function(request, response) {
      response.status(404).send("Page not found!");
    });

    // listen (start app with node server.js) ======================================
    app.listen(3000, function() {
      console.log("Express app started on port 3000.");
    });
