const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    category: {
        type: String,
        required: true,
        max: 50
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
});

module.exports = mongoose.model('Product', productSchema);