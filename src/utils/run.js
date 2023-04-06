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
  var conn = await global.bitmysql_pool.getConnection();
  const [rows] = await conn.query(sql, params);
  conn.release();
  result = rows;
  return result;
};

module.exports = run;
