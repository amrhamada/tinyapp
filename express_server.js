const express = require('express');
const cookie = require('cookie-parser');
const path = require('path');
const {userAuthRouter, users} = require('./routes/userAuth');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
app.use('/', userAuthRouter);

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
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: ''},
  "9sm5xK": {longURL:"http://www.google.com",  userID: ''},
};

const updateShortURL = (oldURl, newURL) => {
  const url = urlDatabase[oldURl];
  urlDatabase[newURL] = url;
  delete urlDatabase[oldURl];
};

const urlsForUser = user => {
  const res = {};
  console.log('user is: ' ,user);
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === user.id) {
      res[key] = urlDatabase[key];
    }
  }
  return res;
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
  const user = users[req.cookies.user_id];
  const db = user ? urlsForUser(user) : {};
  console.log(db)

  let templateVars = { 
    urls: db,
    user,
    register: false
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const user_id = users[req.cookies.user_id];
  if(user_id) {
    let templateVars = { 
      user: user_id,
      register: false
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

app.post("/urls", (req, res) => {
  const user_id = req.cookies.user_id
  const newURL = generateRandomString();
  urlDatabase[newURL] = { longURL: req.body.longURL, userID: user_id}
  res.redirect(`urls/${newURL}`);
});

app.post('/urls/:shortURL', (req,res) => {
  updateShortURL(req.params.shortURL, req.body.newURL);
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params.shortURL);
  console.log(urlDatabase)
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if(longURL){
    res.redirect(longURL);
  } else {
    res.redirect('/urls');
  }

});

app.post('/urls/:shortURL/delete', (req,res) => {
  const user = users[req.cookies.user_id];
  if (!user) {
    res.sendStatus(403); 
    res.redirect('/login');
    return;
  }
  if( urlDatabase[req.params.shortURL].userID === user.id ) {
     delete urlDatabase[req.params.shortURL]
  } else { res.sendStatus(403); }
  res.redirect('/urls')
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id] : '';
  let templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL,
    owner: urlDatabase[req.params.shortURL].userID,
    user,
    register: false
  };
  res.render("urls_show", templateVars);
});

exports.generateRandomString =  generateRandomString;