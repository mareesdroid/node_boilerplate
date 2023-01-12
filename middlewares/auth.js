const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

/**
 * find required rights
 */
function getByValue(map, searchValue, requiredRights) {
  for (let [key, value] of map.entries()) {
    if (key === searchValue && value.includes(requiredRights))
      return requiredRights;
  }
}

/**
 * Verify Access
 */
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  if (requiredRights.length) {
    const hasRequiredRights = requiredRights.every((requiredRight) => getByValue(roleRights, 'user', requiredRights[0]).includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};

/**
 * Verify Access
 */
const verifyCallbackAdmin = (req, resolve, reject, requiredRights) => async (err, admin, info) => {
  if (err || info) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  if (requiredRights.length) {
    const hasRequiredRights = requiredRights.every((requiredRight) => getByValue(roleRights, 'user', requiredRights[0]).includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};


/**
 * Authenicate User roles
 */
const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

/**
 * Authenticate Admin roles
 */
const authAdmin = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallbackAdmin(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};



module.exports = {
  auth,
  authAdmin
}