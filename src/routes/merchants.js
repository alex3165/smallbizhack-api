const express = require('express');
const DB = require('../data/DB');

const database = new DB();

module.exports = express.Router()
.use('/merchants', (req, res) => {
  return database.getMerchants()
  .then(merchants => res.status(200).send(merchants));
});
