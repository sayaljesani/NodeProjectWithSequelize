const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product{
    constructor(title, price, imageUrl, description, id=null, userId){
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }
    
    save() {
        const db = getDb();
        let dbop;
        if (this._id) {
            dbop = db.collection('products').updateOne(
                { _id: this._id }, 
                { $set: this }
            );
        } else {
            dbop = db.collection('products').insertOne(this);
        }
        return dbop
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    }

    static fectchAll(){
        const db = getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(id){
        const db = getDb();

        // Validate the ID before creating an ObjectId
        if (!id || typeof id !== 'string' || id.length !== 24) {
            return Promise.reject('Invalid product ID');
        }

        return db.collection('products')
        .findOne({ _id: new mongodb.ObjectId(id) })
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static deleteById(id){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectId(id)})
        .then(result=>{
            console.log('Deleted item');
        })
         .catch(err => {
            console.log(err);
        });
    }
}

module.exports = Product;