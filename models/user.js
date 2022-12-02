const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})

userSchema.methods.addToCart = function (product) {
    //cek apakah product sudah ada di cart
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    })
    //membuat default quantity
    let newQuantity = 1

    //tampung cart items ke dalam variable updatedCartItems
    const updatedCartItems = [...this.cart.items]

    //jika product sudah ada di cart
    if (cartProductIndex >= 0) {
        //update newQuantity dengan mengambil quantity dari cart items
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
    }
    //jika product belum ada di cart
    else {
        //push product ke dalam variable updatedCartItems
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }

    //update cart items dengan variable updatedCartItems
    this.cart.items = updatedCartItems
    return this.save()
}

userSchema.methods.deleteItemFromCart = function (prodId) {
    //filter cart items dengan productId yang tidak sama dengan prodId
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString()
    })

    //update cart items dengan variable updatedCartItems
    this.cart.items = updatedCartItems
    return this.save()
}

userSchema.methods.clearCart = function () {
    //update cart items dengan array kosong
    this.cart = {
        items: []
    }
    return this.save()
}

module.exports = mongoose.model('User', userSchema)