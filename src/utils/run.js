const util = require('util');
const connect = require('./connect');
const { DbError } = require('./errors');

const isDebugging = process.env.BITMYSQL_DEBUGGING || true;

const run = async (sql, params) => {
  var result = false;
  if (isDebugging) {
    console.log(`SQL: ${sql}`);
    console.log(`Params: ${params}`);
  }
  connect();
  const query = util
    .promisify(global.bitmysql_conn.query)
    .bind(global.bitmysql_conn);
  const rows = await query(sql, params);
  result = rows;
  return result;
};

module.exports = run;
