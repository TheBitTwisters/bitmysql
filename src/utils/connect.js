const mysql = require('mysql2/promise');
const run = require('./run');

global.bitmysql_conn;
global.bitmysql_timezone = process.env.DATABASE_TIMEZONE || '+08:00';
global.bitmysql_config = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASS || '',
  database: process.env.DATABASE_NAME || 'bitmysql',
  connectionLimit: 100,
  idleTimeout: 5000,
};

const connect = function (params = {}) {
  global.bitmysql_config = {
    host: params.host || global.bitmysql_config.host,
    port: params.port || global.bitmysql_config.port,
    user: params.user || global.bitmysql_config.user,
    password: params.password || global.bitmysql_config.password,
    database: params.database || global.bitmysql_config.database,
  };
  if (!global.bitmysql_conn) {
    global.bitmysql_conn = mysql.createPool(global.bitmysql_config);
  }
  return new Promise(async (resolve, reject) => {
    try {
      let params = [];
      params.push(global.bitmysql_timezone);
      await run('SET time_zone = ?', params);
      resolve(true);
    } catch (e) {
      resolve(false);
    }
  });
};

module.exports = connect;
