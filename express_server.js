const express = require('express');
const cookie = require('cookie-parser');
const path = require('path');
const userAuthRouter = require('./routes/userAuthRouter');
const db = require('./db/db');
// const dbHelpers = require('./helpers/dbHelpers')(db.users, db.urlDatabase);
const urlRouter = require('./routes/urlRouter');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
app.use('/user', userAuthRouter);
app.use('/urls', urlRouter);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(db.urlDatabase);
});

