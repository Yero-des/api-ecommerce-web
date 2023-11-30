require('dotenv').config();

const config = {
  appConfig: {
    host: "http://localhost" || process.env.APP_HOST,
    port: 9000 || process.env.APP_HOST
  }
}

module.export = config;