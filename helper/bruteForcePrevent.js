const { authService, adminService } = require('../services/admin');
const { RateLimiterMongo } = require('rate-limiter-flexible');
const { LogsModel } = require('../models/admin');
const { connection } = require('mongoose');
const { getIp, getCurrentIp } = require('./common');

const maxWrongAttemptsByIPperDay = 4;
const maxConsecutiveFailsByUsernameAndIP = 10;
const maxWrongAttemptsByUsernamePerDay = 50;
//db here
const limiterSlowBruteByIP = new RateLimiterMongo({
  storeClient: connection,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,   // 1 day
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 10 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
  storeClient: connection,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60 * 24 * 365 * 20, // Block for infinity after consecutive fails
});

const limiterSlowBruteByUsername = new RateLimiterMongo({
  storeClient: connection,
  keyPrefix: 'login_fail_username_per_day',
  points: maxWrongAttemptsByUsernamePerDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24 * 365 * 20, // Block for infinity after 50 fails
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

async function checkBruteForce(req, res, next) {
  await LogsModel.create({
    ip: getIp(req),
    browser: req.headers["user-agent"],
    language: req.headers["accept-language"],
  })
  //to get local address
  // networkInterfaces[Object.keys(networkInterfaces)[1]][0].address
  const usernameIPkey = getUsernameIPkey(req.body.email, getCurrentIp(req));
  const maxConsecutiveFailsByUsernameAndIP = 10;
  const isDeviceTrusted = await adminService.checkDeviceWasUsedPreviously(usernameIPkey);
  const [resUsernameAndIP, resSlowByIP, resSlowUsername] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(getCurrentIp(req)),
    limiterSlowBruteByUsername.get(req.body.email),
  ]);
  console.log('BRUTE_FORCE', isDeviceTrusted)
  let retrySecs = 0;
  // Check if IP, Username + IP or Username is already blocked
  if (!isDeviceTrusted && resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(retrySecs));
  } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Number.MAX_SAFE_INTEGER;
  } else if (!isDeviceTrusted && resSlowUsername !== null && resSlowUsername.consumedPoints > maxWrongAttemptsByUsernamePerDay) {
    retrySecs = Number.MAX_SAFE_INTEGER;
  }

  if (retrySecs > 0) {
    res.status(429).send('Too Many Requests');
  } else {
    const user = await authService.checkLogin(req.body.email, req.body.password, req.body.pattern);
    if (!user.isLoggedIn) {
      try {
        const limiterPromises = [];
        if (!isDeviceTrusted) {
          limiterPromises.push(limiterSlowBruteByIP.consume(getCurrentIp(req)));
        }

        if (user.exists) {
          // Count failed attempts only for registered users
          limiterPromises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
          if (!isDeviceTrusted) {
            limiterPromises.push(limiterSlowBruteByUsername.consume(req.body.email));
          }
        }

        if (limiterPromises.length > 0) {
          await Promise.all(limiterPromises);
        }
        res.status(400).end('email or password is wrong');
      } catch (rlRejected) {
        if (rlRejected instanceof Error) {
          throw rlRejected;
        } else {
          // All available points are consumed from some/all limiters, block request
          res.status(429).send({ message: 'Too Many Requests' });
        }
      }
    }

    if (user.isLoggedIn) {
      if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
        // Reset only consecutive counter after successful authorisation
        await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
      }
      next()
    }
  }
}

module.exports = checkBruteForce;