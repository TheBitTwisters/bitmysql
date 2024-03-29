const queries = require('../queries');
const errors = require('../utils/errors');

const BaseModel = class BaseModel {
  static get tableName() {
    return '';
  }
  static get sortBy() {
    return {
      id: 'DESC',
    };
  }
  static get limit() {
    return 10;
  }

  id = 0; // int

  static paginateBy(page = 1) {
    return {
      limit: this.limit,
      offset: (page - 1) * this.limit,
    };
  }

  static newFromDb(param) {
    var newThis = new this(param);
    for (let key in Object.keys(this)) {
      newThis[key] = param.key;
    }
    return newThis;
  }

  static count(whereParams, likeParams) {
    return new Promise(async (resolve, reject) => {
      try {
        var q = new queries.SearchQuery();
        await q
          .select('COUNT(*)')
          .from(this.tableName)
          .where(whereParams)
          .like(likeParams)
          .execute();
        var count = q.getSingleValue(0);
        resolve(count);
      } catch (err) {
        console.log(err);
        reject(new errors.DbSearchError(err));
      }
    });
  }
  static search(whereParams, likeParams, sortBy = null, page = 1) {
    return new Promise(async (resolve, reject) => {
      try {
        var paging = this.paginateBy(page);
        var q = new queries.SearchQuery();
        await q
          .select('*')
          .from(this.tableName)
          .where(whereParams)
          .like(likeParams)
          .sortBy(sortBy || this.sortBy)
          .limit(paging.limit)
          .offset(paging.limit > -1 ? paging.offset : -1)
          .execute();
        var results = q.getList();
        var list = [];
        for (var result of results) {
          list.push(this.newFromDb(result));
        }
        resolve(list);
      } catch (err) {
        reject(new errors.DbSearchError(err));
      }
    });
  }

  static getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        var q = new queries.Query();
        await q
          .select('*')
          .from(this.tableName)
          .sortBy(this.sortBy)
          .execute();
        var results = q.getList();
        var list = [];
        for (var result of results) {
          list.push(this.newFromDb(result));
        }
        resolve(list);
      } catch (err) {
        reject(new errors.DbSelectError(err));
      }
    });
  }

  static get(params) {
    return new Promise(async (resolve, reject) => {
      try {
        var q = new queries.Query();
        await q
          .select('*')
          .from(this.tableName)
          .where(params)
          .execute();
        var result = q.getOne();
        if (result) {
          resolve(this.newFromDb(result));
        }
        resolve(false);
      } catch (err) {
        reject(new errors.DbSelectError(err));
      }
    });
  }

  static delete(whereParams) {
    return new Promise(async (resolve, reject) => {
      try {
        var q = new queries.Delete();
        await q
          .deleteFrom(this.tableName)
          .where(whereParams)
          .execute();
        resolve(q.result);
      } catch (err) {
        reject(new errors.DbDeleteError(err));
      }
    });
  }

  static softDelete(whereParams, columnData = null) {
    return new Promise(async (resolve, reject) => {
      try {
        var u = new queries.Update();
        await u
          .update(this.tableName)
          .set(columnData ?? { active: 0 })
          .where(whereParams)
          .execute();
        resolve(u.result);
      } catch (err) {
        reject(new errors.DbUpdateError(err));
      }
    });
  }

  constructor(param = {}) {
    this.id = param.id || 0;
  }

  updateData(params) {
    for (let key in params) {
      this[key] = params[key];
    }
  }

  save() {
    return new Promise(async (resolve, reject) => {
      try {
        let jsonData = await this.getUpdatedData();
        if (Object.keys(jsonData).length > 0) {
          if (this.id > 0) {
            var u = new queries.Update();
            await u
              .update(this.constructor.tableName)
              .set(jsonData)
              .where({ id: this.id })
              .execute();
            if (u.result) {
              if (this.hasOwnProperty('updated_at')) {
                var q = new queries.CustomQuery();
                await q
                  .setSql(
                    `UPDATE ${this.constructor.tableName} SET updated_at = now() WHERE id = ${this.id}`
                  )
                  .execute();
              }
              resolve(true);
            }
          } else {
            var i = new queries.Insert();
            await i
              .insertInto(this.constructor.tableName)
              .values(jsonData)
              .execute();
            if (i.insertId > 0) {
              this.id = i.insertId;
              resolve(true);
            }
          }
        }
        resolve(false);
      } catch (err) {
        if (this.id > 0) {
          reject(new errors.DbUpdateError(err));
        } else {
          reject(new errors.DbInsertError(err));
        }
        reject(false);
      }
    });
  }

  toJsonData() {
    return {};
  }
  async getUpdatedData() {
    if (this.id && this.id > 0) {
      let newData = {};
      let oldThis = await this.constructor.get({ id: this.id });
      for (let key of Object.keys(this)) {
        if (this[key] && this[key] != oldThis[key]) {
          newData[key] = this[key];
        }
      }
      return newData;
    }
    return this.toJsonData();
  }
};

module.exports = BaseModel;
