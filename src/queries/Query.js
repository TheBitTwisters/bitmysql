import run from './run'
import BaseSelect from './BaseSelect'

class Query extends BaseSelect {
  async execute() {
    this.results = await run(this.getSql(), this.whereValues)
  }
}

export default Query
