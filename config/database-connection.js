const pgp = require('pg-promise')();

let cn = {};
if (process.env.NODE_ENV === 'production') {
  cn = {
    host: '',
    port: 5432,
    database: '',
    user: '',
    password: '',
  };
} else {
  cn = {
    host: 'localhost',
    port: 5432,
    database: 'authdatabase',
    user: '********',
    password: '********',
  };
}

const db = pgp(cn);

module.exports = db;
