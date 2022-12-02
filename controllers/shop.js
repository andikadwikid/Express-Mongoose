const Product = require('../models/product')
const Order = require('../models/order')
const mongoose = require('mongoose')

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (err) {
    console.log(err)
  }
}

exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId)
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (err) {
    console.log(err)
  }
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find()
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/',
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (err) {
    console.log(err)
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId')
    // console.log(req.session.user.cart.items)
    const products = user.cart.items
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId

  try {
    const product = await Product.findById(prodId)
    await req.user.addToCart(product)
    res.redirect('/cart')
  } catch (err) {
    console.log(err)
  }
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      'user.userId': req.user._id
    })
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (err) {
    console.log(err)
  }
}

exports.postOrder = async (req, res, next) => {

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const user = await req.user.populate('cart.items.productId')
    const products = user.cart.items.map(i => {
      return {
        quantity: i.quantity,
        product: {
          ...i.productId._doc
        }
      }
    })

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products: products
    })

    await order.save({
      session: session
    })
    await req.user.clearCart({
      session: session
    })

    await session.commitTransaction()

    res.redirect('/orders')
  } catch (err) {
    await session.abortTransaction()
    console.log(err)
  }
}