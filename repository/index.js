const pgPromise = require('pg-promise');
const dotenv = require('dotenv').config();
const UsersRepository = require('./UsersRepository');

let dbConfig = {};
// Production config
if (process.env.NODE_ENV === 'production') {
  dbConfig = {
    host: '',
    port: 5432,
    database: '',
    user: '',
    password: '',
  };
} else if (process.env.NODE_ENV === 'test') { // Test config
  dbConfig = {
    host: 'localhost',
    port: 5432,
    database: 'authtest',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
} else { // Development config
  dbConfig = {
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
}

const initOptions = {
  extend(obj, dc) {
    obj.users = new UsersRepository(obj, pgp);
  }
};

// Initializing the library:
const pgp = pgPromise(initOptions);

// Creating the database instance:
const db = pgp(dbConfig);

// Alternatively, you can get access to pgp via db.$config.pgp
module.exports = { db, pgp };
