const request = require('supertest');
const express = require('express');
const assert = require('assert');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('../config/passport');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(require('../routes'));

describe('Test Auth routes', () => {
  let cookies = [];
  before("Getting the token for the cookie", done => {
    request(app)
      .post('/api/users/login')
      .send({ email: "john.doe@test.com", password: "password" })
      .end(function (err, res) {
        if (err) return done(err);
        cookies = res.header["set-cookie"];
        done();
      });
  });
  describe('GET /api/auth/ping', () => {
    it('responds with 401 when no cookie is provided', done => {
      request(app)
        .get('/api/auth/ping')
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
  it('responds with 200 when cookie is provided', done => {
    request(app)
      .get('/api/auth/ping')
      .set('Cookie', cookies)
      .expect(200)
      .expect(res => {
        assert(res.text, 'User logged in');
      })
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});

