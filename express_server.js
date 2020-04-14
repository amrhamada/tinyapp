const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let count = 0;
  while (count < 6){
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    count++;
  }
  return result;
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const newURL = generateRandomString();
  urlDatabase[newURL] = req.body.longURL;
  res.redirect(`urls/${newURL}`);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_new", templateVars);
});

app.post('/urls/:shortURL/delete', (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[ req.params.shortURL];
  if(longURL){
    res.redirect(longURL);
  } else {
    res.redirect('/urls');
  }

});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

