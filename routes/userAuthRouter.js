const express = require('express');
const router = express.Router();
const db = require('../db/db');
const dbHelpers = require('../helpers/dbHelpers')(db.users, db.urlDatabase);


router.get('/register', (req, res) => {
  const templatevars = {
    user: '',
    register: true
  };
  res.render('urls_register', templatevars);
 }); 

 router.post('/register',  (req, res) => {
  const {email, password} = req.body;
  const found = dbHelpers.userExist(email);
  if (!found){
    const newID = dbHelpers.generateRandomString();
    db.users[newID] = {
        id: newID,
        email,
        password
    };
    res.cookie('user_id', newID)
    res.redirect('/urls');
  } else {
    res.sendStatus(400);
  }
  
 }); 

router.get('/login', (req, res) => {
  let templateVars = { 
    user: '',
    register: false
  };
  res.render('urls_login', templateVars)
});

router.post("/login", (req, res) => {
  const {email , password} = req.body;
  const user = dbHelpers.findUser(email, password);
  if (user){
    res.cookie('user_id',user.id);
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
  
 });
 
router.post("/logout", (req, res) => {
   res.clearCookie('user_id');
   res.redirect('/urls');
  });
 
  module.exports = router;