const express = require('express');
const configureMiddleware = require('../config/middleware');

const zoosRouter = require("../zoosRoutes/zoosRouter");
const bearsRouter = require("../bearsRoutes/bearsRouter");

// Server Initialization
const server = express();

// Middleware
configureMiddleware(server);

//Routes
server.use("/api/zoos", zoosRouter);
server.use("/api/bears", bearsRouter);

module.exports = server;