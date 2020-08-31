const router = require('express').Router();
const passport = require('passport');
const { auth } = require('../../service/authService');
const asyncHandler = require('../../service/asyncHandler');

router.get('/ping', auth.required, asyncHandler(async function (req, res, next) {
  res.send('User logged in');
}));

router.get('/google',
  passport.authenticate('google', {
    scope: ["profile", "email"]
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:8080/#/login', session: false }), function (req, res, next) {
    res.cookie('token', req.user.generateJWT());
    return res.redirect('http://localhost:8080/#/profile');
  }
);

router.get('/logout', auth.required, asyncHandler(async function (req, res, next) {
  res.cookie('token', '', { expires: new Date(0) });
  res.send('Logging out');
}));

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: 'http://localhost:8080/#/login', session: false }), function (req, res, next) {
    res.cookie('token', req.user.generateJWT());
    return res.redirect('http://localhost:8080/#/profile');
  }
);

module.exports = router;
