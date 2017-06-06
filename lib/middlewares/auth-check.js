// Modified from https://vladimirponomarev.com/blog/authentication-in-react-apps-jwt
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const secret = require('../../secret/secret');

/**
 *  The Auth Checker middleware function.
 */
export default (req, res, next) => {

  if (['/login', '/signup'].includes(req.originalUrl) ) {
    return next();
  }

  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, secret.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.user.id;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }

      return next();
    });
  });
};