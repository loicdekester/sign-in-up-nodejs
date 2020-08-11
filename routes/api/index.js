const router = require('express').Router();

router.use(function (err, req, res, next) {
  return next(err);
});

module.exports = router;
