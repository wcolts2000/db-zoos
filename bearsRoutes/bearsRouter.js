const express = require('express');
const db = require('../data/dbConfig')

const router = express.Router();

// add bear
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears)
    })
    .catch(err => res.status(500).json({ message: "there was an error retrieving the bears info requested"}))
})

// get single bear
router.get('/:id', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

 module.exports = router