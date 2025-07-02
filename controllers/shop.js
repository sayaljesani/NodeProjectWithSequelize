const Product = require('../models/product');
// const Cart = require('../models/cart');
const Order = require('../models/orders');

exports.getProducts = (req, res, next) => {

  Product.find().then(products=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => {
    console.log(err);
  });
  
}
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId).then((product)=>{
    res.render('shop/product-detail', { path:'/products', proddetails: product, pageTitle: product.title } );
  }).catch(err => console.log(err));
  
};
exports.getindex = (req, res, next) => {
  Product.find().then(products=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => {
    console.log(err);
  });
  
}

exports.getcart = (req, res, next) => {
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  })
  .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  
  // Make sure req.user exists and is properly initialized
  if (!req.user) {
    return res.redirect('/');
}

Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId).then(result =>{
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) =>{
  req.user
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items;
    return req.user.addOrder(products);
  }).then(result => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};

exports.getorders = (req, res, next) => {

  Order.find({'userId': req.user._id}).then(orders=>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  }).catch(err => {
    console.log(err);
  });
  
};