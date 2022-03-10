const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    title: String,
    coverUrl: String,
    country: String,
    numOfDays: Number,
    startCity: String,
    endCity: String,
    lastUpdate: Date
});

module.exports = mongoose.model('Trip', tripSchema);