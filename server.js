"use strict";
//  IMPORTS

    let express = require('express');

//  VARIABLES

    let port = process.env.PORT || 3000;
    let app = express();

    app.use(express.static('./example'));
    app.use(express.static('./build'));

//  ROUTES

    app.get('/', function (req, res, next) {
        res.sendFile(__dirname + '/example/index.html');
    });

//  SERVER

    let server = require('http').Server(app);

    server.listen(port, function () {
        console.log('Server listening [%s]', port);
    });