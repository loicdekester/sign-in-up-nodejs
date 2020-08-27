const jwt = require('express-jwt');
const jsonWebToken = require('jsonwebtoken');
const secret = require('../config/auth-secret').secret;

function getTokenFromCookie(req) {
  return req.cookies.token;
}

function getIdFromToken(req) {
  const token = getTokenFromCookie(req)
  return jsonWebToken.decode(token).id;
}

const auth = {
  required: jwt({
    secret: secret,
    algorithms: ['HS256'],
    userProperty: 'payload',
    getToken: getTokenFromCookie
  }),
  optional: jwt({
    secret: secret,
    algorithms: ['HS256'],
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromCookie
  })
};

module.exports = { auth, getIdFromToken };
