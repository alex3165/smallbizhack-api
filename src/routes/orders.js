const express = require('express');

module.exports = express.Router()
.use('/test', (req, res) => {
  res.status(200).send({ hello: 'test' });
});
