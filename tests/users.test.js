const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('../config/passport');
const assert = require('assert');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(require('../routes'));

describe('Test user routes', () => {
  describe('POST /api/users', () => {
    it('responds with status 403 and message "User already exists" when email already in database', done => {
      request(app)
        .post('/api/users')
        .send({ user: { firstName: "John", lastName: "Doe", email: "john.doe@test.com", password: "password" } })
        .expect(403)
        .expect(res => {
          assert(res.error.text, 'User already exists');
        })
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('responds with status 201 and message "User created successfully" when it creates a new user', done => {
      request(app)
        .post('/api/users')
        .send({ user: { firstName: "Peter", lastName: "Robinson", email: "peter.robinson@test.com", password: "password" } })
        .expect(201)
        .expect(res => {
          assert(res.text, 'User created successfully');
        })
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
  let cookies = [];
  describe('POST /api/users/login', () => {
    it('responds with status 401 and message "Password is incorrect" when the password is wrong', done => {
      request(app)
        .post('/api/users/login')
        .send({ email: "john.doe@test.com", password: "wrongpassword" })
        .expect(401)
        .expect(res => {
          assert(res.error.text, 'Password is incorrect');
        })
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('responds with status 401 and message "Email is incorrect" when the password is wrong', done => {
      request(app)
        .post('/api/users/login')
        .send({ email: "peter.doe@test.com", password: "password" })
        .expect(401)
        .expect(res => {
          assert(res.error.text, 'Email is incorrect');
        })
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('login with password and email', done => {
      request(app)
        .post('/api/users/login')
        .send({ email: "john.doe@test.com", password: "password" })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
  describe("", () => {
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
    describe('GET /api/users', () => {
      it('should get the user from the database with keys id, firstName, lastName and email', done => {
        request(app)
          .get('/api/users')
          .set('Cookie', cookies)
          .expect(200)
          .expect(res => {
            assert.deepEqual(res.body, {
              user: {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@test.com'
              }
            });
          })
          .end(function (err, res) {
            if (err) return done(err);
            done();
          });
      });
    });
    describe('PUT /api/users', () => {
      it('should update the user from the database', done => {
        request(app)
          .put('/api/users')
          .set('Cookie', cookies)
          .send({
            user: {
              firstName: "James",
              lastName: "Dean",
              email: 'john.doe@test.com'
            }
          })
          .expect(200)
          .expect(res => {
            assert.deepEqual(res.body, {
              user: {
                id: 1,
                firstName: 'James',
                lastName: 'Dean',
                email: 'john.doe@test.com'
              }
            });
          })
          .end(function (err, res) {
            if (err) return done(err);
            done();
          });
      });
    });
    describe('DELETE /api/users', () => {
      it('should delete the user from the database', done => {
        request(app)
          .delete('/api/users')
          .set('Cookie', cookies)
          .expect(200)
          .expect(res => {
            assert(res.text, 'User deleted successfully');
          })
          .end(function (err, res) {
            if (err) return done(err);
            done();
          });
      });
    });
  });
});
