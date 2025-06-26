const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');
const shopController = require('../controllers/shop')

const router = express.Router();

router.get('/', shopController.getindex);

router.get('/products', shopController.getProducts);

router.get('/cart', shopController.getcart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteItem);

router.get('/products/:productId', shopController.getProduct);

router.get('/orders', shopController.getorders);

router.post('/create-order', shopController.postOrder);

module.exports = router;