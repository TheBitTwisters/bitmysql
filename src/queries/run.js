const { createPool } = require('mysql2/promise');

const isDebugging = process.env.MYSQLHELPER_DEBUGGING || true;

const my_config = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
};

// declare global connection for bitmysql
global.bitmysql_conn;

const initPool = () => {
  if (!global.bitmysql_conn) {
    global.bitmysql_conn = createPool(my_config);
  }
};

const run = async (sql, params) => {
  var result = false;
  if (isDebugging) {
    console.log(`SQL: ${sql}`);
    console.log(`Params: ${params}`);
  }
  try {
    initPool();
    const [rows] = await global.bitmysql_conn.query(sql, params);
    result = rows;
  } catch (err) {
    console.error(err);
  } finally {
    return result;
  }
};

module.exports.initPool = initPool;
module.exports = run;
