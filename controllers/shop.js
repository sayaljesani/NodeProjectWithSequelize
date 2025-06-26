const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');
const { where } = require('sequelize');

exports.getProducts = (req, res, next) => {

  Product.findAll().then(products=>{
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

  // Product.findAll({where: {id: prodId}}).then(products=>{
  //   res.render('shop/product-detail', { path:'/products', proddetails: products[0], pageTitle: products[0].title } );
  // }).catch(err => {
  //   console.log(err);
  // });
  Product.findByPk(prodId).then((product)=>{
    res.render('shop/product-detail', { path:'/products', proddetails: product, pageTitle: product.title } );
  }).catch(err => console.log(err));
  
  // res.redirect('/');
};
exports.getindex = (req, res, next) => {
  Product.findAll().then(products=>{
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

  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
    .then(products =>{
        res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fechedCart;
  let newQuantity = 1;

  req.user.getCart()
  .then(cart => {
    fechedCart = cart;
    return cart.getProducts({ where: { id: prodId } });
  }).then(products => {
    let product;
    if(products.length > 0){
      product = products[0];
    }
    if(product){  
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(prodId);
  }).then(product=>{
      return fechedCart.addProduct(product, { through : { quantity : newQuantity } });
    })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
  
}

exports.postCartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart =>{
    return cart.getProducts({ where: {id: prodId}});
  })
  .then(products=>{
    const product = products[0];
    return product.cartItem.destroy();
  })
  .then(result =>{
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) =>{
  let fechedCart;
  req.user.getCart()
  .then(cart => {
    fechedCart = cart;
    return cart.getProducts();
  }).then( products =>{ 
    return req.user.createOrder()
    .then(order=>{
      return order.addProduct(products.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      }))
    })
    .catch(err => console.log(err));
  })
  .then(result =>{
    return fechedCart.setProducts(null);
  })
  .then(result => {
    res.redirect('/orders');
  })
  .catch(err => console.log(err));
};

exports.getorders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders =>{
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders
    });
  })
  .catch(err => console.log(err));
  
};