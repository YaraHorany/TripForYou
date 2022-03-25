const mongoose = require('mongoose');
const Trip = require('../models/trip');
const locations = require('./locations');
const { count } = require('../models/trip');
const { json } = require('express/lib/response');


mongoose.connect('mongodb://localhost:27017/trips', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const lastUpdate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (date + ' ' + time);
}

const seedDB = async () => {
    await Trip.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const numOfDays = Math.floor(Math.random() * 14) + 1; // return a random number from 1 to 14
        const randLocation = Math.floor(Math.random() * 40);
        const trip = new Trip({
            author: '623e2bb936f9ceccd3282c3a',
            country: locations[randLocation].country,
            numOfDays,
            startCity: locations[randLocation].cities[Math.floor(Math.random() * 4)],
            endCity: locations[randLocation].cities[Math.floor(Math.random() * 4)],
            lastUpdate: lastUpdate(),
            images: [
                {
                    url: 'https://res.cloudinary.com/df1uukigz/image/upload/v1647885168/trip4u/wjb4ceexgjfzmukq9pvh.jpg',
                    filename: 'trip4u/wjb4ceexgjfzmukq9pvh'
                }
            ]
        })
        await trip.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})