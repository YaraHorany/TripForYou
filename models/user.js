const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// ******************** FACEBOOK ********************
const findOrCreate = require('mongoose-findorcreate');
// ******************** FACEBOOK ********************


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: String,
    googleName: String
    // ******************** FACEBOOK ********************
    //facebookId: String
    // ******************** FACEBOOK ********************    
});

UserSchema.plugin(passportLocalMongoose);
// ******************** FACEBOOK ********************
UserSchema.plugin(findOrCreate);
// ******************** FACEBOOK ********************

module.exports = mongoose.model('User', UserSchema);
