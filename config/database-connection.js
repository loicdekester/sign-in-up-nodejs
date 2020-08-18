const pgp = require('pg-promise')();
const dotenv = require('dotenv');
dotenv.config();

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
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
}

const db = pgp(cn);

module.exports = db;
