/**
 * Created by usman iqbal on 7/31/2018.
 */
var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema;

var BanksSchema = new Schema({
    bankCode: { type: String, required: true },
    bankName: { type: String, required: true },
    isArchive : {type : Boolean, default: false}
});

BanksSchema.plugin(timestamps);

module.exports = mongoose.model('Banks', BanksSchema);