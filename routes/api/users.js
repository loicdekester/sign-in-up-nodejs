const router = require('express').Router();
const { db } = require('../../repository/index');
const passport = require('passport');
const { auth, getIdFromToken } = require('../../service/authService');
const User = require('../../models/User');
const asyncHandler = require('../../service/asyncHandler');

router.post('/users', asyncHandler(async function (req, res, next) {
  try {
    const user = new User();
    user.firstName = req.body.user.firstName;
    user.lastName = req.body.user.lastName;
    user.email = req.body.user.email;
    await user.setEncryptedPassword(req.body.user.password);
    return db.tx('add-user', async t => {
      let oldUser = await t.users.findByEmail(user.email);
      if (!oldUser) {
        await t.users.add(user);
        res.status(201).send("User created successfully");
      } else {
        res.status(403).send("User already exists");
      }
    });
  } catch (error) {
    res.status(500).send(new Error(error));
  }
}));

router.post('/users/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }
    if (user) {
      res.cookie('token', user.generateJWT());
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ["profile", "email"]
  })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:8080/login', session: false }), function (req, res, next) {
    res.cookie('token', req.user.generateJWT());
    return res.redirect('http://localhost:8080/');
  }
);

router.get('/users', asyncHandler(async function (req, res, next) {
  const dbUser = await db.users.findById(getIdFromToken(req));
  if (dbUser) {
    const user = new User();
    user.setUserFromDB(dbUser);
    return res.json({ user: user.toAuthJSON() });
  } else {
    const error = new Error("User not found");
    return res.status(404).json({ error });
  }
}));

router.put('/users', auth.required, asyncHandler(async function (req, res, next) {
  return db.tx('update-user', async t => {
    const payload = req.body.user;
    payload.id = getIdFromToken(req);
    const updatedUser = new User();
    const dbUser = await t.users.update(payload);
    updatedUser.setUserFromDB(dbUser);
    res.status(200).json({ user: updatedUser.toAuthJSON() });
  });
}));

router.delete('/users', auth.required, asyncHandler(async function (req, res, next) {
  const result = await db.users.delete(getIdFromToken(req));
  console.log(result);
  res.status(200).send('User deleted successfully');
}));

module.exports = router;
