const Queries = require('./queries');
const BaseModel = require('./models/BaseModel');
const connect = require('./utils/connect');

module.exports.connect = connect;
module.exports.Models = { BaseModel };
module.exports.BaseModel = BaseModel;
module.exports.Queries = Queries;
