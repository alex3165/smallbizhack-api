const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mainRoutes = require('../routes');

const PORT = 8081;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(mainRoutes);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
