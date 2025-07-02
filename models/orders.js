const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    items:[{
        product: {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            title: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String },
            imageUrl: { type: String }
        },
        quantity: {type: Number, required: true}
    }],
    userId:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Order', OrderSchema);