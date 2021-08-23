module.exports = {
  apps: [
    {
      name: 'doccano',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start',
      // env: {
      //   PORT: 3001,
      //   NODE_ENV: 'production'
      // }
    }
  ]
}