const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const merchantsRoute = require('./routes/merchants');
const ordersRoute = require('./routes/orders');


const PORT = process.env.PORT || 8081;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(merchantsRoute);
app.use(ordersRoute);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
