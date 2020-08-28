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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/api/auth/facebook/callback",
  profileFields: ['name', 'email'],
},
  async function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    if (profile.emails) {
      const user = await findOrCreate(profile, profile.emails[0]);
      done(null, user);
    } else {
      done(null, false, 'email is not verified')
    }
  })
);

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
},
  async function (token, tokenSecret, profile, done) {
    if (profile.emails) {
      const user = await findOrCreate(profile);
      done(null, user);
    } else {
      done(null, false, 'email is not verified')
    }
  })
);

async function findOrCreate(profile, email) {
  const verifiedEmail = email || profile.emails.find(email => email.verified);
  const oldUser = await db.users.findByEmail(verifiedEmail.value);
  if (!oldUser) {
    let user = new User;
    user.firstName = profile.name.givenName;
    user.lastName = profile.name.familyName;
    user.email = verifiedEmail.value;
    const dbUser = await db.users.add(user);
    user.setUserFromDB(dbUser);
    return user;
  } else {
    const user = new User;
    user.setUserFromDB(oldUser);
    return user;
  }
}
