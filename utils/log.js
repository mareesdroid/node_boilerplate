const { ServerLogs } = require("../models");
const { AdminLogs } = require("../models/admin");


/**
 * Custom console logs
 */

const log = () => {
    const consoleLog = console.log;
    const errorLog = console.error;
    const infoLog = console.info
    console.log = async function (d) {
        // originalFunc.apply(console, [string].concat([].slice.call(arguments)))
        consoleLog(d)
    }
    console.info = async function (d) {
        // originalFunc.apply(console, [string].concat([].slice.call(arguments)))
        infoLog(d)
        // add some callbacks like save data to db or store it to logs
    }
    console.error = async function (d) {
        // originalFunc.apply(console, [string].concat([].slice.call(arguments)))
        errorLog(d)
                // add some callbacks like save data to db or store it to logs
    }
};

module.exports = log;