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

// ===================================
// ============ ZOOS ENDPOINTS =======
// ===================================
// add zoo
server.post('/api/zoos', (req, res) => {
  const { name } = req.body;
  
  if(name.length) {
    db('zoos')
      .insert(req.body)
      .then(ids => {
        db('zoos')
          .where({ id: ids[0]})
          .then(zoo => {
            res.status(201).json(zoo)
          });
      })
      .catch(err => res.status(500).json({message: "there was an error posting the zoo info"}));

  } else { res.status(400).json({message: "Must include a name"})}
  
})

// list zoos
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos)
    })
    .catch(err => res.status(500).json({message: "there was an error retrieving the zoos info requested"}))
})

// list single zoo
server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id})
    .then(zoo => {
      if(zoo.length) {
        res.status(200).json(zoo)
      } else {
        res.status(404).json({ message: "No zoo found with that id"})
      }
    })
    .catch(err => res.status(500).json({message: "there was an error retrieving the zoo info requested"}))
})

// update zoo
server.put('/api/zoos/:id', (req, res) => {
  const changedZoo = req.body;

  if(changedZoo.name.length) {
    db('zoos')
      .where({ id: req.params.id})
      .update(changedZoo)
      .then(count => {
        if(count) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ message: "No zoo found with that id"})
        }
      })
      .catch(err => res.status(500).json({message: "there was an error updating the zoo"}))
  } else {res.status(400).json({ message: "Must provide name updates..."})}

})

// delete zoo
server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id})
    .del()
    .then(count => {
      if(count) {
        res.status(200).json(count)
      } else {
        res.status(404).json({ message: "no zoo found with that id"})
      }
    })
    .catch(err => res.status(500).json({message: "there was an error deleting the zoo"}))
})

// ===================================
// =========== BEARS ENDPOINTS =======
// ===================================

// add bear
server.post('/api/bears', (req, res) => {
  const { name } = req.body;

  if(name.length) {
    db('bears')
      .insert(req.body)
      .then(ids => {
        db('bears')
        .where({ id: ids[0]})
        .then(bear => res.status(201).json(bear))
      })
      .catch(err => res.status(500).json({ message: "there was an error posting the bear info"}))
  } else {res.status(400).json({ message: "must include a name"})}
})

// get bears list
server.get('/api/bears', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears)
    })
    .catch(err => res.status(500).json({ message: "there was an error retrieving the bears info requested"}))
})

// get single bear
server.get('/api/bears/:id', (req, res) => {
  db('bears')
  .where({ id: req.params.id})
  .then(bear => {
    if(bear.length) {
      res.status(200).json(bear)
    } else {
      res.status(404).json({ message: "No bear by found with that id"})
    }
  })
  .catch( err => res.status(500).json({ message: "there was an error retrieving the bear info requested"}))
})

// update bear
server.put('/api/bears/:id', (req, res) => {
  const changedBear = req.body;

  if(changedBear.name.length) {
    db('bears')
    .where({ id: req.params.id})
    .update(changedBear)
    .then(count => {
      if(count) {
        res.status(200).json(count)
      } else {
        res.status(404).json({ message: "No bear found with that id"})
      }
    })
    .catch(err => res.status(500).json({message: 'there was an error updating the bear'}))
  } else { res.status(400).json({ message: 'Must provide name updates...'})}
})

// delete bear
server.delete('/api/bears/:id', (req, res) => {
  db('bears')
  .where({ id: req.params.id})
  .del()
  .then(count => {
    if(count) {
      res.status(200).json(count)
    } else {
      res.status(404).json({ message: "no bear found with that id"})
    }
  })
  .catch(err => res.status(500).json({ message: "there was an error deleting the bear"}))
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
