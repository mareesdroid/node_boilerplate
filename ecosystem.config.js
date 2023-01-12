module.exports = {
  apps: [{
    name: "mars-boilerplate",
    script: "server.js",
    exp_backoff_restart_delay: 100,
    shutdown_with_message: true,
    watch: true,
    args: [
      "--color"
    ],
    ignore_watch: ["node_modules", "logs"],
    env: {
      NODE_ENV: 'dev'
    }
  }]
}
