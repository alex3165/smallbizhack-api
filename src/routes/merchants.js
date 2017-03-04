const express = require('express');
const DB = require('../data/DB');

const database = new DB();

module.exports = express.Router()
.use('/merchants/:id', (req, res) => {
  return database.getMerchant(req.params.id)
  .then(merchant => res.status(200).send(merchant));
})
.use('/merchants', (req, res) => {
  return database.getMerchants()
  .then(merchants => res.status(200).send(merchants));
});
