const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', { 
    pageTitle: 'Add Product', 
    path: '/admin/add-product',
    editing: false,
    });
}

exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({title: title, price: price, imageUrl: imageUrl, description: description, userId: req.user});
  product.save()
  .then(result=>{
    // console.log(result);
    console.log('Created Product');
    res.redirect('/admin/products');
  }).catch(err=>{
    console.log(err);
  });
  
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product =>{
    res.render('admin/edit-product', { 
      pageTitle: 'Edit Product', 
      path: '/admin/edit-product', 
      editing: editMode,
      product: product
    });
  }).catch(err=> console.log(err));
 
}

exports.postEditProducts = (req, res, next) => {
  const id = req.body.id;
  const updatedtitle = req.body.title;
  const updatedimageUrl = req.body.imageUrl;
  const updatedprice = req.body.price;
  const updateddescription = req.body.description;

  Product.findById(id).then(product=>{
    product.title = updatedtitle;
    product.imageUrl = updatedimageUrl;
    product.price = updatedprice;
    product.description = updateddescription;

    product.save();
  }).then(result =>{ 
    console.log('udpate Product');
    res.redirect('/admin/products');
  }).catch(err => {console.log(err)});
  
};
exports.postDeleteProducts = (req, res, next) => {
  const prodId = req.body.id;
  Product.findByIdAndDelete(prodId)
  .then(result =>{
    console.log('Desctroy Product');
    res.redirect('/admin/products');
  })
  .catch(err => console.log(err));
  
};
exports.getProducts = (req, res, next) => {

  Product.find().then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => {
    console.log(err);
  });

}
