const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.mongoose.url, config.mongoose.options);
mongoose.Promise = global.Promise;
const db = mongoose.connection

module.exports = db