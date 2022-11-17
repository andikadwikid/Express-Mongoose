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
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
})

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    })
    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.deleteItemFromCart = function (prodId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString()
    })
    this.cart.items = updatedCartItems
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save()
}

// userSchema.methods.addOrder = function () {
//     return this.getCart()
//         .then(cart => {
//             const products = cart.items.map(i => {
//                 return { quantity: i.quantity, product: { ...i.productId._doc } }
//             })
//             const order = new Order({
//                 user: {
//                     email: this.email,
//                     userId: this
//                 },
//                 products: products
//             })
//             return order.save()
//         })
//         .then(result => {
//             this.cart = { items: [] }
//             return this.save()
//         })
// }

// userSchema.methods.getCart = function () {
//     const productIds = this.cart.items.map(i => {
//         return i.productId
//     })

//     return this.model('Product').find({ _id: { $in: productIds } })
//         .then(products => {
//             return products.map(p => {
//                 return {
//                     ...p._doc,
//                     quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString()
//                     }).quantity,
//                 }
//             })
//         })
// }

module.exports = mongoose.model('User', userSchema)