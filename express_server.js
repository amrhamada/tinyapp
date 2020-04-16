const express = require('express');
const cookie = require('cookie-session');
const userAuthRouter = require('./routes/userAuthRouter');
const db = require('./db/db');
const urlRouter = require('./routes/urlRouter');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie({
  name: 'user-session',
  keys: ['a5376b06-97bf-4159-b737-22642a995dd4', '16aefe91-9211-4a1b-a9dc-fc738bf89e6f']
}));
app.use('/user', userAuthRouter);
app.use('/urls', urlRouter);

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(db.urlDatabase);
});

