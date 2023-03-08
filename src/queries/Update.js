import run from './run'

class Update {
  table = ""
  columns = []
  columnValues = []
  whereKeys = []
  whereValues = []
  result = false

  update(table) {
    this.table = table
    return this
  }
  set(params) {
    this.columns = []
    this.columnValues = []
    for (var key in params) {
      if (params[key] !== undefined) {
        this.columns.push(key)
        this.columnValues.push(params[key])
      }
    }
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
    var columns = []
    for (var column of this.columns) {
      columns.push(column += '=?')
    }
    var sql = `
      UPDATE ${this.table}
         SET ${columns.join()}
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
    var values = [
      ...this.columnValues,
      ...this.whereValues
    ]
    var result = await run(this.getSql(), values)
    this.result = result.changedRows > 0
  }
}

export default Update
