
module.exports = (users, urlDatabase) => {

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

  const updateShortURL = (oldURl, newURL) => {
    const url = urlDatabase[oldURl];
    urlDatabase[newURL] = url;
    delete urlDatabase[oldURl];
  };

  const urlsForUser = user => {
    const res = {};
    for (const key in urlDatabase) {
      if (urlDatabase[key].userID === user.id) {
        res[key] = urlDatabase[key];
      }
    }
    return res;
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

  return {
    generateRandomString,
    updateShortURL,
    urlsForUser,
    userExist,
    findUser
  };

};