const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

require('dotenv').config()

const errorController = require('./controllers/error')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('636fe0c87220dd2d02ac3cee')
        req.user = user
        next()
    }
    catch (err) {
        console.log(err)
    }
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404)

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'dika',
                    email: 'dika@gmai.com',
                    cart: {
                        items: []
                    }
                })
                user.save()
            }
        })

        app.listen(process.env.PORT || 3000)
        console.log('Connected to MongoDB');
    })
    .catch(err => console.log(err))


