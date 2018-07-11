const mongoose = require('mongoose')
const medSchema = require('./medSchema')
var Schema = mongoose.Schema;

const ordSchema = new Schema({
    patient :String,
    orderalias: String,
    address : String,
    med : [Schema.Types.Mixed],
    dose : Number,
    total : Number,
    totalprofit : Number,
  }, { collection: 'myOrd'})

  module.exports = mongoose.model('ord',ordSchema);