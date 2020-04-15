const express = require('express');
const router = express.Router();
const  generateRandomString = require('../express_server');

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const userExist = email => {
  for (const key in users){
    if(users[key].email === email){
      return true;
    }
  }
};

const findUser = (email, password) => {
  for (const key in users){
    if(users[key].email === email && users[key].password === password){
      return users[key]//, email }
    }
  }
};


router.get('/register', (req, res) => {
  const templatevars = {
    user: '',
    register: true
  };
  res.render('urls_register', templatevars);
 }); 

 router.post('/register',  (req, res) => {
  const {email, password} = req.body;
  const found = userExist(email);
  if (!found){
    const newID = generateRandomString.generateRandomString();
    users[newID] = {
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
  const user = findUser(email, password);
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
 
  module.exports = {userAuthRouter:router, users};