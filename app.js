/** IMPORTS */
const express = require('express'),
  helmet = require('helmet'),
  morgan = require('morgan'),
  path = require('path');

/** ROUTES IMPORTS*/
const indexRouter = require('./routes/index');

/** Environment variable */
const isProduction = process.env.NODE_ENV === 'production';

/** Global app object */
const app = express();

/** Express configuration */
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

/** Routes */

app.use(require('./routes'));

/** catch 404 and forward to error handler */
app.use(function (req, res, next) {
  var err = new Error(`Not Found: ${req.ip} tried to reach ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

/** Error handlers */

/** Dev */
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      'errors': {
        message: err.message,
        error: err
      }
    });
  });
}

/** Prod */
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});

/** Start server */
const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + server.address().port);
});

module.exports = app;
