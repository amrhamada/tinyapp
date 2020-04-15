const express = require('express');
const router = express.Router();
const  generateRandomString = require('../express_server');


const findUser = email => {
  for (const key in users){
    if(users[key].email === email){
      return true;
    }
  }
};
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
}
router.get('/register', (req, res) => {
  const templatevars = {
    username: '',
    register: true
  };
  res.render('urls_register', templatevars);
 }); 

 router.post('/register',  (req, res) => {
  const {email, password} = req.body;
  const found = findUser(email);
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

router.post("/login", (req, res) => {
  const {email , password} = req.body;
  
  // const user_id = users.find(
  //   (user_id) => user.email=== email && user.password === password
  // );

  res.cookie('user_id',user_id);
  res.redirect('/urls');
 });
 
router.post("/logout", (req, res) => {
   res.clearCookie('user_id');
   res.redirect('/urls');
  });
 
  module.exports = {userAuthRouter:router, users};