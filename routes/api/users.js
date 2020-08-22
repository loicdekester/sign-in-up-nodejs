const router = require('express').Router();
const sql = require('../../sql');
const db = require('../../config/database-connection');
const passport = require('passport');
const { auth, getIdFromToken } = require('../../service/authService');
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
      } else {
        res.status(403).send("User already exists");
      }
    });
  } catch (error) {
    res.status(500).send(new Error(error));
  }
});

router.post('/users/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }
    if (user) {
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.get('/user', auth.required, async function (req, res, next) {
  try {
    const id = getIdFromToken(req);
    const dbUser = await db.oneOrNone(sql.users.findById, { id });
    if (dbUser) {
      const user = new User();
      user.setUserFromDB(dbUser);
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send(new Error(error));
  }
});

module.exports = router;
