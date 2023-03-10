// declare global connection for bitmysql
const { createPool } = require('mysql2/promise');

global.bitmysql_conn;
global.bitmysql_config = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASS || '',
  database: process.env.DATABASE_NAME || 'bitmysql',
};

const connect = (params = {}) => {
  let config = {
    host: params.host || global.bitmysql_config.host,
    port: params.port || global.bitmysql_config.port,
    user: params.user || global.bitmysql_config.user,
    password: params.password || global.bitmysql_config.password,
    database: params.database || global.bitmysql_config.database,
  };
  if (!global.bitmysql_conn) {
    global.bitmysql_conn = createPool(config);
    global.bitmysql_config = config;
  }
  return new Promise((resolve, reject) => {
    global.bitmysql_conn.getConnection(function (err, conn) {
      if (err) resolve(false);
      resolve(true);
    });
  });
};

module.exports = connect;
