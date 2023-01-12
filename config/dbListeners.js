const db = require('./db')
const chalk = require('chalk');


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
process.on('message', function (msg) {
  console.log(chalk.blue.bgWhiteBright.bold(`${msg}`))
  if (msg == 'shutdown' || msg == 'process killed') {
    console.log(chalk.blue.bgWhiteBright.bold(`Closing mongo connection`))
    setTimeout(function () {
      console.log(chalk.blue.bgWhiteBright.bold(`Finished closing connections.... Server Out`))
      process.exit(0)
    }, 1500)
  }
})