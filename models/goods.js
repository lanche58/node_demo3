const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Schema[ˈskiːmə]
const productSchema = new Schema({
    'productId': String,
    'productName': String,
    'salePrice': Number,
    'productImage': String,
    'productNum': String,
    'checked': String
});
// 第一参数是对应的[集合]名字的[单数]形式，Mongoose会自动找到名称是model名字[复数]形式的collection 。
module.exports = mongoose.model('good', productSchema); 