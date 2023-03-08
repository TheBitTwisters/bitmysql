import queries from '../queries';

const BaseModel = class BaseModel {
  static get tableName() {
    return '';
  }
  static get sortBy() {
    return {
      id: 'DESC',
    };
  }

  id = 0; // int

  static search(whereParams, likeParams) {
    return new Promise(async (resolve, reject) => {
      try {
        var q = new queries.SearchQuery();
        await q
          .select('*')
          .from(this.tableName)
          .where(whereParams)
          .like(likeParams)
          .sortBy(this.sortBy)
          .execute();
        var results = q.getList();
        var list = [];
        for (var result of results) {
          list.push(new this(result));
        }
        resolve(list);
      } catch (err) {
        console.error(err);
        reject({
          err: true,
          code: 503,
          message: 'Internal(DB) server error',
        });
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
          list.push(new this(result));
        }
        resolve(list);
      } catch (err) {
        console.error(err);
        reject({
          err: true,
          code: 503,
          message: 'Internal(DB) server error',
        });
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
          resolve(new this(result));
        }
        resolve(false);
      } catch (err) {
        console.error(err);
        reject({
          err: true,
          code: 503,
          message: 'Internal(DB) server error',
        });
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
        console.error(err);
        reject({
          err: true,
          code: 503,
          message: 'Internal(DB) server error',
        });
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
        var jsonData = this.toJsonData();
        if (Object.keys(jsonData).length > 0) {
          if (this.id > 0) {
            var u = new queries.Update();
            await u
              .update(this.constructor.tableName)
              .set(jsonData)
              .where({ id: this.id })
              .execute();
            if (u.result) {
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
        console.error(err);
        reject({
          err: true,
          code: 503,
          message: 'Internal(DB) server error',
        });
      }
    });
  }

  toJsonData() {
    return {};
  }
};

export default BaseModel;
