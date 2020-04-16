const { assert } = require('chai');
const db = require('../db/db');

const helpers = require('../helpers/dbHelpers')(db.users, db.urlDatabase);

const testUsers = {
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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = helpers.getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal( user, expectedOutput);
    
  });
  it('should return a user undefined', function() {
    const user = helpers.getUserByEmail("user5@example.com", testUsers)
    const expectedOutput = undefined
    assert.equal( user, expectedOutput);
    
  });
});
