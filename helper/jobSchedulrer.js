const schedule = require('node-schedule');
const chalk = require('chalk');

/**
 * 
 * @param {*} time  // which time to start
 * @param {*} callBack // what function to be called
 * @param {*} id // what are the params to sent
 *  job sceduler runs on exact time unlesss cron it runs only one time
 */
const jobSchedulrer = (time, callBack, id) => {
    console.log(chalk.blue.bgRed.bold('calling scheduler'))
    const date = new Date(time);
    schedule.scheduleJob(date, function (id) {
        callBack(id);
    }.bind(null, id));
}

module.exports = jobSchedulrer;