const mongoose = require("mongoose");
const User = require("./models/user");

module.exports = connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });
        console.log("Connected to MongoDB");
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "dika",
                    email: "dika@gmai.com",
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });
    } catch (err) {
        console.log(err);
    }
};