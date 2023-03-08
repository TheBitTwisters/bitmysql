import run from './run'
import BaseSelect from './BaseSelect'

class SearchQuery extends BaseSelect {
  likeKeys = []
  likeValues = []

  like(params) {
    this.likeKeys = []
    this.likeValues = []
    for (var key in params) {
      if (params[key] !== undefined) {
        this.likeKeys.push(key)
        this.likeValues.push(params[key])
      }
    }
    return this
  }

  getSqlWhereLike() {
    var sql = ''
    for (var like of this.likeKeys) {
      var params = []
      for (let i = 0; i < this.whereKeys.length; i++) {
        if (like !== this.whereKeys[i]) {
          params[this.whereKeys[i]] = this.whereValues[i]
        }
      }
      this.where(params)
    }
    if (this.whereKeys.length > 0 || this.likeKeys.length > 0) {
      var ws = []
      for (var where of this.whereKeys) {
        ws.push(where += "=?")
      }
      for (var like of this.likeKeys) {
        ws.push(like + " LIKE CONCAT('%', ?,  '%')")
      }
      sql += "WHERE " + ws.join(' AND ')
    }
    return sql
  }
  getSql() {
    var sql = ''
    sql += this.getSqlSelect()
    sql += this.getSqlFrom()
    sql += this.getSqlWhereLike()
    sql += this.getSqlSortBy()
    return sql.replace(/\s+/g,' ').trim()
  }

  async execute() {
    var values = [
      ...this.whereValues,
      ...this.likeValues
    ]
    this.results = await run(this.getSql(), values)
  }
}

export default SearchQuery
