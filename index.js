const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const port = 8080;

app.get('/', (req, res) => {
  res.send('Welcome to j-Flix!');
});

app.listen(port, () => {
  console.log(`j-Flix server is running on port ${port}`);
});