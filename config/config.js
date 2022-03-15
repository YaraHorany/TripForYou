require('dotenv').config()

module.exports = {
    facebook: {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET
    }
}