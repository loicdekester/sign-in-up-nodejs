var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
FacebookStrategy = require('passport-facebook').Strategy;
const sql = require('../sql');
const db = require('../repository/index');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

passport.use(new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  authenticateUser
));

async function authenticateUser(email, password, done) {
  try {
    const dbUser = await db.oneOrNone(sql.users.findByEmail, { email });
    if (dbUser) {
      const user = new User();
      user.setUserFromDB(dbUser);
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

/*passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://www.example.com/auth/facebook/callback"
},
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));*/
