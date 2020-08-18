const router = require('express').Router();
const sql = require('../../sql');
const db = require('../../config/database-connection');
const passport = require('passport');
//const auth = require('../auth');
const User = require('../../models/User');

router.post('/users', async function (req, res, next) {
  try {
    const user = new User();
    user.firstName = req.body.user.firstName;
    user.lastName = req.body.user.lastName;
    user.email = req.body.user.email;
    await user.setEncryptedPassword(req.body.user.password);
    return db.tx('add-user', async t => {
      let oldUser = await db.oneOrNone(sql.users.findByEmail, { email: user.email });
      if (!oldUser) {
        const valuesArray = Object.values(user);
        valuesArray.shift();
        await db.none(sql.users.add, valuesArray);
        res.status(201).send("User created successfully");
      }
      res.status(403).send("User already exists");
    });
  } catch (error) {
    res.status(500).send(new Error(error));
  }

});

router.post('/users/login', function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

module.exports = router;
