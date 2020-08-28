const router = require('express').Router();

router.use('/', require('./users'));
router.use('/auth', require('./auth'));

router.use(function (err, req, res, next) {
  return next(err);
});

module.exports = router;
