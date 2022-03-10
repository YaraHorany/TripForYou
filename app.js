const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Trip = require('./models/trip');

const app = express();

mongoose.connect('mongodb://localhost:27017/trips', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const lastUpdate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (date + ' ' + time);
}

app.get('/trips', async (req, res) => {
    const trips = await Trip.find({});
    res.render('trips/index', { trips });
})

app.get('/trips/new', (req, res) => {
    res.render('trips/new');
})

app.get('/trips/:id', async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    res.render('trips/show', { trip });
})

app.post('/trips', async (req, res) => {
    const trip = new Trip(req.body.trip);
    trip.lastUpdate = lastUpdate();
    await trip.save();
    res.redirect('/trips');
})

app.get('/trips/:id/edit', async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    res.render('trips/edit', { trip });
})

app.put('/trips/:id', async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, { ...req.body.trip });
    await trip.save();
    res.redirect(`/trips/${trip._id}`);
})

app.delete('/trips/:id', async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.redirect('/trips');
})

app.listen(8080, () => {
    console.log("Listening on port 8080");
})