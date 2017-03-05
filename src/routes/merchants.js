const express = require('express');
const DB = require('../data/DB');

const database = new DB();

module.exports = express.Router()
.post('/merchants/:id/invoices', (req, res) => {
  return database.createInvoice(
    req.params.id,
    req.body.order
  )
  .then(merchants => res.status(200).send(merchants));
})
.get('/merchants/:id/invoices', (req, res) => {
  return database.getInvoices(req.params.id)
  .then(merchants => res.status(200).send(merchants));
})
.get('/merchants/:id', (req, res) => {
  return database.getMerchant(req.params.id)
  .then(merchant => res.status(200).send(merchant));
})
.get('/merchants', (req, res) => {
  return database.getMerchants({ lat: req.query.lat, lng: req.query.lng })
  .then(merchants => res.status(200).send(merchants));
});
