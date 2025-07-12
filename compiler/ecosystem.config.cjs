module.exports = {
  apps: [
    {
      name: "compiler-server",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
    },
    {
      name: "worker",
      script: "worker.js",
      instances: 3,
      exec_mode: "fork",
    }
  ]
};
