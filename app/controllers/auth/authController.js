const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const config = require('../../../config/config');

// middleware check token is invalid when requested
exports.jwtMiddleware = (req, res, next) => {
  const token = req.headers[process.env.AUTHORIZATION_HEADER || config.AUTHORIZATION_HEADER_DEFAULT];

  if (token) {
    jwt.verify(token, jwtSecret, function(err, decoded) {
      if (err) {
        return res.status(401).json({ errorMsg: __('token_invalid') });
      }
      req.decoded = decoded;

      next();
    });
  } else {
    return res.status(401).json({ errorMsg: __('token_invalid') });
  }
};
