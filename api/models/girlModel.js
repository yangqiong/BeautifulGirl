const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GirlSchema = new Schema({
    id: String,
    tags: [String],
    name: String,
    url: String,
    poster: String,
    imgs: [String]
});

module.exports = mongoose.model('aitaomus', GirlSchema);