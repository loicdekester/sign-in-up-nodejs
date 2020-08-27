var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
FacebookStrategy = require('passport-facebook').Strategy;
GoogleStrategy = require('passport-google-oauth20').Strategy;
const { db } = require('../repository/index');
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
    const dbUser = await db.users.findByEmail(email);
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
  callbackURL: "http://localhost:3000/api/auth/facebook/callback"
},
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function (err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));*/

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
},
  async function (token, tokenSecret, profile, done) {
    const user = await findOrCreate(profile);
    done(null, user);
  })
);

async function findOrCreate(profile) {
  const verifiedEmail = profile.emails.find(email => email.verified);
  const oldUser = await db.users.findByEmail(verifiedEmail.value);
  if (!oldUser) {
    const user = new User;
    user.firstName = profile.name.givenName;
    user.lastName = profile.name.familyName;
    user.email = verifiedEmail.value;
    const newUser = await db.users.add(user);
    return newUser
  } else {
    const user = new User;
    user.setUserFromDB(oldUser);
    return user
  }
}
