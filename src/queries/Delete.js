import run from './run'

class Delete {
  table = ""
  whereKeys = []
  whereValues = []
  result = false

  deleteFrom(table) {
    this.table = table
    return this
  }
  where(params) {
    this.whereKeys = []
    this.whereValues = []
    for (var key in params) {
      if (params[key] !== undefined) {
        this.whereKeys.push(key)
        this.whereValues.push(params[key])
      }
    }
    return this
  }

  getSql() {
    var sql = `
      DELETE FROM ${this.table}
    `
    if (this.whereKeys.length > 0) {
      var ws = []
      for (var where of this.whereKeys) {
        ws.push(where += "=?")
      }
      sql += "WHERE " + ws.join(' AND ')
    }
    return sql.replace(/\s+/g,' ').trim()
  }

  async execute() {
    var result = await run(this.getSql(), this.whereValues)
    this.result = result.affectedRows > 0
  }
}

export default Delete
