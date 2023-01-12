const schedule = require('node-schedule');

const cronInit = (hour = 0, minute = 0) => {
    let winners = []
    console.info(`updating cron time ${minute} ${hour}`)
    schedule.scheduleJob(`${minute} ${hour} * * *`, async function () {
    console.info(`add cron task here`)
    });
}

const disableAllJobs = () => {
    schedule.gracefulShutdown();
}

module.exports = {
    cronInit,
    disableAllJobs
}


