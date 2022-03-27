const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');


const UserSchema = new Schema({
    email: String,
    username: String,

    googleId: String,
    googleName: String,
    googleEmail: String,

    facebookId: String,
    facebookName: String,
    facebookEmail: String
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
