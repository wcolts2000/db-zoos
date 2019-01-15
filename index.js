const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const knex = require('knex');

const dbConfig = require('./knexfile');

const server = express();

const db = knex(dbConfig.development)


server.use(express.json());
server.use(morgan('short'));
server.use(helmet());

// endpoints here

// sanity check
server.get('/', (req, res) => {
  res.send("api working");
});



const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
