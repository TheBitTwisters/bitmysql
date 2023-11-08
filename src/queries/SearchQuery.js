const run = require('../utils/run');
const BaseSelect = require('./BaseSelect');

class SearchQuery extends BaseSelect {
  likeKeys = [];
  likeValues = [];

  like(params) {
    this.likeKeys = [];
    this.likeValues = [];
    for (var key in params) {
      if (params[key] !== undefined) {
        this.likeKeys.push(key);
        this.likeValues.push(params[key]);
      }
    }
    return this;
  }

  getSqlWhereLike() {
    var sql = '';
    for (var like of this.likeKeys) {
      var params = [];
      for (let i = 0; i < this.whereKeys.length; i++) {
        if (like !== this.whereKeys[i]) {
          params[this.whereKeys[i]] = this.whereValues[i];
        }
      }
      this.where(params);
    }
    var ws = [];
    if (this.whereKeys.length > 0) {
      for (var where of this.whereKeys) {
        ws.push((where += '=?'));
      }
      sql += 'WHERE ' + ws.join(' AND ');
    }
    var ls = [];
    if (this.likeKeys.length > 0) {
      for (var like of this.likeKeys) {
        ls.push(like + " LIKE CONCAT('%', ?,  '%')");
      }
      if (ws.length == 0) {
        sql += 'WHERE ';
      } else {
        sql += ' OR ';
      }
      sql += ls.join(' OR ');
    }
    return sql;
  }
  getSql() {
    var sql = '';
    sql += this.getSqlSelect();
    sql += this.getSqlFrom();
    sql += this.getSqlWhereLike();
    sql += this.getSqlSortBy();
    return sql.replace(/\s+/g, ' ').trim();
  }

  async execute() {
    var values = [...this.whereValues, ...this.likeValues];
    this.results = await run(this.getSql(), values);
  }
}

module.exports = SearchQuery;
