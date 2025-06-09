const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose") //install- npm i passport-local-mongoose
//username & password automatically generates


const userSchema = new Schema({
    email: {
        type: String,
        required: true,

    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);













































