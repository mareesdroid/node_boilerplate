const express = require("express");
const authRoute = require("./auth.route");
const adminApis = require("./admin");
const userApis = require("./user.route");
const config = require("../../config/config");
const router = express.Router();

const devRoutes = [
  // routes available only in development mode
  {
    path: "/auth",
    route: authRoute,
  },
];


const prodRoutes = [
  // routes available only in development mode
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/admin",
    route: adminApis,
  },
  {
    path: "/user",
    route: userApis,
  },
];

/* istanbul ignore next */
if (config.env == "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}
if (config.env == "prod") {
  prodRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
