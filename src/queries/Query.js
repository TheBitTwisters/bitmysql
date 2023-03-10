const run = require('../util/run');
const BaseSelect = require('./BaseSelect');

class Query extends BaseSelect {
  async execute() {
    this.results = await run(this.getSql(), this.whereValues);
  }
}

module.exports = Query;
