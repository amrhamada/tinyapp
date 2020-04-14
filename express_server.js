const express = require('express');
const cookie = require('cookie-parser');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
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

const updateShortURL = (oldURl, newURL) => {
  const url = urlDatabase[oldURl];
  urlDatabase[newURL] = url;
  delete urlDatabase[oldURl];
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

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.post("/login", (req, res) => {
 const username = req.body.username;
 res.cookie('username',username);
 res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  const username = req.body.username;
  res.clearCookie('username',username);
  res.redirect('/urls');
 });

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const newURL = generateRandomString();
  urlDatabase[newURL] = req.body.longURL;
  res.redirect(`urls/${newURL}`);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.post('/urls/:shortURL', (req,res) => {
  updateShortURL(req.params.shortURL, req.body.newURL);
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[ req.params.shortURL];
  if(longURL){
    res.redirect(longURL);
  } else {
    res.redirect('/urls');
  }

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
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

