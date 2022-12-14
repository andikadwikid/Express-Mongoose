const path = require('path')
const connection = require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

require('dotenv').config()

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()
const store = new MongoDBStore({
    uri: 'mongodb+srv://root:8Y02V4kVerNQssVY@cluster0.zgrqfwt.mongodb.net/shop',
    collection: 'sessions'
})

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

connection()

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    try {
        const user = await User.findById(req.session.user._id)
        req.user = user
        next()
    } catch (err) {
        console.log(err)
    }
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.use(errorController.get404)
app.listen(process.env.PORT || 3000)