const connect = require('./connect');

const isDebugging = process.env.MYSQLHELPER_DEBUGGING || true;

const run = async (sql, params) => {
  var result = false;
  if (isDebugging) {
    console.log(`SQL: ${sql}`);
    console.log(`Params: ${params}`);
  }
  try {
    connect();
    const [rows] = await global.bitmysql_conn.query(sql, params);
    result = rows;
  } catch (err) {
    console.error(err);
  } finally {
    return result;
  }
};

module.exports = run;
