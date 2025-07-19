module.exports = {
  apps: [
    {
      name: 'compiler-server',
      script: './server.js',
      instances: 1,
      autorestart: true
    },
    {
      name: 'worker',
      script: './worker.js',
      instances: 3,
      autorestart: true
    }
  ]
}