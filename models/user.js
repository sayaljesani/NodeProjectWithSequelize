const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('./orders');

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items:[{
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true}
        }]
    }
});

userSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }

    const updatedCart = { items: updatedCartItems };
    
    // Update the local cart property as well
    this.cart = updatedCart;
    
    return this.save();
}

userSchema.methods.deleteItemFromCart = function(productId){
    const updatedCartItems = this.cart.items.filter(item =>{
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.addOrder = function(products){
    // console.log(products);
    const orderItems = products.map(item => {
        return {
            product: {
                productId: item.productId._id,
                title: item.productId.title,
                price: item.productId.price,
                description: item.productId.description,
                imageUrl: item.productId.imageUrl
            },
            quantity: item.quantity
        }
    });
    // console.log(orderItems);
    const order = new Order({
        items:orderItems,
        userId: this._id
    });

    return order.save().then(result=>{
        this.cart = { items: [] };
        return this.save();
    });
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User{
//     constructor(username, email, cart, id){
//         this.name = username;
//         this.email = email;
//         this.cart = cart || { items: [] };
//         this._id = id;
//     }

//     save(){
//         const db = getDb();

//         return db.collection('users')
//         .insertOne(this)
//         .then(result => {
//             console.log(result);
//             return result;
//         })
//         .catch(err => {
//             console.log(err);
//             throw err;
//         });
//     }

//     addToCart(product) {
//         const db = getDb();
        
//         // Ensure cart and items are initialized
//         if (!this.cart) {
//             this.cart = { items: [] };
//         }
        
//         if (!this.cart.items) {
//             this.cart.items = [];
//         }
        
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
        
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectId(product._id),
//                 quantity: newQuantity
//             });
//         }

//         const updatedCart = { items: updatedCartItems };
        
//         // Update the local cart property as well
//         this.cart = updatedCart;
        
//         return db.collection('users').updateOne(
//             { _id: new mongodb.ObjectId(this._id) }, 
//             { $set: { cart: updatedCart } }
//         );
//     }

//     getCart(){
//         const db = getDb();

//          // Check if cart exists and has items
//         if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
//             return Promise.resolve([]);  // Return empty array if no cart or items
//         }

//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db.collection('products')
//         .find({ _id: { $in : productIds } })
//         .toArray()
//         .then(products => {
//             return products.map(p => {
//                 return { 
//                     ...p, 
//                     quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString();
//                     }).quantity
//                 }
//             })
//         })
//     }

//     deleteItemFromCart(productId){
//         if (!this.cart || !this.cart.items) {
//             return Promise.resolve();
//         }
//         const updatedCartItems = this.cart.items.filter(item =>{
//             return item.productId.toString() !== productId.toString();
//         });
//         this.cart.items = updatedCartItems;
//         const db = getDb();
//         return db
//         .collection('users')
//         .updateOne( 
//             { _id: new mongodb.ObjectId(this._id) }, 
//             { $set : {cart: {items: updatedCartItems}}} 
//         ); 
//     }

//     addOrder(){
//         const db = getDb();
//         return this.getCart().then(products =>{
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.name,
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         }).then(result =>{
//             this.cart = { items: [] };
//             return db
//             .collection('users')
//             .updateOne( 
//                 { _id: new mongodb.ObjectId(this._id) }, 
//                 { $set : {cart: {items: []}}} 
//             ); 
//         }) 
//     }

//     getOrders(){
//         const db = getDb();
//         return db
//         .collection('orders')
//         .find({'user._id': new mongodb.ObjectId(this._id)})
//         .toArray();
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users')
//         .findOne({ _id: new mongodb.ObjectId(userId) })
//         .then(user => {
//             if (user) {
//                 // Ensure cart is initialized
//                 user.cart = user.cart || { items: [] };
//                 return new User(user.name, user.email, user.cart, user._id);
//             }
//             return null;
//         });
//     }
// }

// module.exports = User;