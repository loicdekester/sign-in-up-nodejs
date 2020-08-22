const jwt = require('express-jwt');
const jsonWebToken = require('jsonwebtoken');
const secret = require('../config/auth-secret').secret;

function getTokenFromHeader(req) {
  let token = null
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }
  return token;
}

function getIdFromToken(req) {
  const token = getTokenFromHeader(req)
  return jsonWebToken.decode(token).id;

}

const auth = {
  required: jwt({
    secret: secret,
    algorithms: ['HS256'],
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    algorithms: ['HS256'],
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = { auth, getIdFromToken };
