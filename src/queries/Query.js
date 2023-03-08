const run = require('./run');
const BaseSelect = require('./BaseSelect');

class Query extends BaseSelect {
  async execute() {
    this.results = await run(this.getSql(), this.whereValues);
  }
}

export default Query;
