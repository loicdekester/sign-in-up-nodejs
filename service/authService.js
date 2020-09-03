const jwt = require('express-jwt');
const jsonWebToken = require('jsonwebtoken');
const secret = require('../config/auth-secret').secret;

/**
 * Returns the token from the cookie passed with the request
 * @param {Object} req Http request
 */
function getTokenFromCookie(req) {
  return req.cookies ? req.cookies.token : undefined;
}

/**
 * Returns the id of the user making a request
 * @param {Object} req Http request
 */
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
