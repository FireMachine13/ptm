const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});