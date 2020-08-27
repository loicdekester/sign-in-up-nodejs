const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../config/auth-secret').secret;

class User {
  _id = null;
  _firstName = "";
  _lastName = "";
  _email = "";
  _password = "";

  constructor() { }

  get firstName() {
    return this._firstName;
  }

  set firstName(firstName) {
    this._firstName = firstName;
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(lastName) {
    this._lastName = lastName;
  }

  get email() {
    return this._email;
  }

  set email(email) {
    this._email = email;
  }

  get password() {
    return this._password;
  }

  set password(password) {
    this._password = password;
  }

  async setEncryptedPassword(password) {
    await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          reject(new Error(err));
        } else {
          this._password = hash;
          resolve();
        }
      });
    });
  }

  setUserFromDB(dbUser) {
    this._id = dbUser.id;
    this._firstName = dbUser.first_name;
    this._lastName = dbUser.last_name;
    this._email = dbUser.email;
    this._password = dbUser.password;
  }

  generateJWT = function () {
    return jwt.sign({
      id: this._id,
      email: this._email,
    }, secret);
  };

  toAuthJSON() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
    };
  };

}

module.exports = User;
