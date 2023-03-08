import run from './run'
import BaseSelect from './BaseSelect'

class CustomQuery extends BaseSelect {
  sql = ''
  paramValues = []
  setSql(sql) {
    this.sql = sql
    return this
  }
  setParams(params) {
    this.paramValues = []
    for (var key in params) {
      this.paramValues.push(params[key])
    }
    return this
  }
  async execute() {
    this.results = await run(this.sql, this.paramValues)
  }
}

export default CustomQuery
