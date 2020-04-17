const express = require('express');
const router = express.Router();
const db = require('../db/db');
const dbHelpers = require('../helpers/dbHelpers')(db.users, db.urlDatabase);

router.get("/", (req, res) => {
  const user = db.users[req.session.user_id];
  const urls = user ? dbHelpers.urlsForUser(user) : {};
  let templateVars = {
    urls,
    user,
    register: false
  };
  res.render("urls_index", templateVars);
});


router.get("/new", (req, res) => {
  const user_id = db.users[req.session.user_id];
  if (user_id) {
    let templateVars = {
      user: user_id,
      register: false
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

router.post("/", (req, res) => {
  const user_id = req.session.user_id;
  const newURL = dbHelpers.generateRandomString();
  db.urlDatabase[newURL] = {longURL: req.body.longURL, userID: user_id};
  res.redirect(`urls/${newURL}`);
});

router.put('/:shortURL', (req,res) => {
  dbHelpers.updateShortURL(req.params.shortURL, req.body.newURL);
  res.redirect('/urls');
});

router.delete('/:shortURL', (req,res) => {
  const user = db.users[req.session.user_id];
  if (!user) {
    res.sendStatus(403);
    res.redirect('/login');
    return;
  }
  if (db.urlDatabase[req.params.shortURL].userID === user.id) {
    delete db.urlDatabase[req.params.shortURL];
  } else {
    res.sendStatus(403);
  }
  res.redirect('/urls');
});

router.get("/:shortURL", (req, res) => {
  const user = db.users[req.session.user_id] ? db.users[req.session.user_id] : '';
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: db.urlDatabase[req.params.shortURL].longURL,
    owner: db.urlDatabase[req.params.shortURL].userID,
    user,
    register: false
  };
  res.render("urls_show", templateVars);
});

module.exports = router;