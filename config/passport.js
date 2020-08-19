var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const sql = require('../sql');
const db = require('../config/database-connection');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  authenticateUser
));

async function authenticateUser(email, password, done) {
  try {
    let dbUser = await db.oneOrNone(sql.users.findByEmail, { email });
    if (dbUser) {
      const user = new User();
      user.setUserFromDB(dbUser);
      console.log(user);
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password is incorrect" });
        }
      });
    } else {
      return done(null, false, { message: "Email is incorrect" });
    }
  } catch (error) {
    console.log(error);
  }

};
