import run from './run'

class Insert {
  table = ""
  columns = []
  columnValues = []
  insertId = 0

  insertInto(table) {
    this.table = table
    return this
  }
  values(params) {
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

  getSql() {
    var columns = []
    var values = []
    for (var column of this.columns) {
      columns.push('`'+column+'`')
      values.push('?')
    }
    var sql = `
      INSERT INTO ${this.table}
                  (${columns.join()})
           VALUES (${values.join()})
    `
    return sql.replace(/\s+/g,' ').trim()
  }

  async execute() {
    var result = await run(this.getSql(), this.columnValues)
    this.insertId = result.insertId
  }
}

export default Insert
