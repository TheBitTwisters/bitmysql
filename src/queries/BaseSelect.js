/**
 *
 */
class BaseSelect {
  table = ""
  fields = []
  whereKeys = []
  whereValues = []
  groupKeys = []
  sortKeys = {}
  limitValue = -1
  offsetValue = -1
  results = null

  getOne(def = false) {
    if (Array.isArray(this.results)) {
      if (this.results.length > 0) {
        return this.results[0]
      }
    }
    return def
  }
  getList(def = []) {
    if (Array.isArray(this.results)) {
      if (this.results.length > 0) {
        return this.results
      }
    }
    return def
  }
  getFields() {
    var fields = []
    if (Array.isArray(this.results)) {
      if (this.results.length > 0) {
        for (var key in this.results[0]) {
          fields.push(key)
        }
      }
    }
    return fields
  }

  select(params) {
    this.fields = []
    if (Array.isArray(params)) {
      for (var key of params) {
        this.fields.push(key)
      }
    } else {
      this.fields.push(params)
    }
    return this
  }
  from(table) {
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
  groupBy(groupKeys) {
    this.groupKeys = groupKeys
    return this
  }
  sortBy(sortKeys) {
    this.sortKeys = sortKeys
    return this
  }
  limit(val) {
    this.limitValue = val
    return this
  }
  offset(val) {
    this.offsetValue = val
    return this
  }

  getSqlSelect() {
    return ` SELECT ${this.fields.join()} `
  }
  getSqlFrom() {
    return ` FROM ${this.table} `
  }
  getSqlWhere() {
    var sql = ''
    if (this.whereKeys.length > 0) {
      var ws = []
      for (var where of this.whereKeys) {
        ws.push(where + "=?")
      }
      sql += " WHERE " + ws.join(' AND ')
    }
    return sql
  }
  getSqlGroupBy() {
    var sql = ''
    if (this.groupKeys.length > 0) {
      sql += " GROUP BY " + this.groupKeys.join(' , ')
    }
    return sql
  }
  getSqlSortBy() {
    var sql = ''
    var sorts = []
    for (var sortKey in this.sortKeys) {
      sorts.push(`\`${sortKey}\`` + " " + this.sortKeys[sortKey])
    }
    if (sorts.length > 0) {
      sql += " ORDER BY " + sorts.join(' , ')
    }
    return sql
  }
  getSql() {
    var sql = ''
    sql += this.getSqlSelect()
    sql += this.getSqlFrom()
    sql += this.getSqlWhere()
    sql += this.getSqlGroupBy()
    sql += this.getSqlSortBy()
    return sql.replace(/\s+/g,' ').trim()
  }
}

module.exports = BaseSelect
