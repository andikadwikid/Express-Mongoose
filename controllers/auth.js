const User = require("../models/user")

exports.getLogin = (req, res, next) => {
    console.log(req.session)
    const isLoggedIn = req.session.isLoggedIn
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: isLoggedIn,
    })
}

exports.postLogin = async (req, res, next) => {

    const user = await User.findById("636fe0c87220dd2d02ac3cee")

    req.session.isLoggedIn = true
    req.session.user = user
    req.session.save((err) => {
        console.log(err)
        res.redirect("/")
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/")
    })
}