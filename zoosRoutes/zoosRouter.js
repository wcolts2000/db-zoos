const express = require('express');
const db = require('../data/dbConfig')

const router = express.Router();

// add zoo
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos)
    })
    .catch(err => res.status(500).json({message: "there was an error retrieving the zoos info requested"}))
})

// list single zoo
router.get('/:id', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

 module.exports = router;