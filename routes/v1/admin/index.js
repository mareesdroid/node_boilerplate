const authRoute = require('./auth.route');
const userRoute = require('./user.route');

const express = require('express');
const router = express.Router();

const adminRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
  {
    path: '/admin',
    route: userRoute
  }
]

adminRoutes.forEach(({ path, route }) => {
    router.use(path, route);
});

module.exports = router;
