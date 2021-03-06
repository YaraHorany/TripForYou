const Trip = require('../models/trip');
const { cloudinary } = require('../cloudinary');

const lastUpdate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return (date + ' ' + time);
}

module.exports.index = async (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const trips = await Trip.find({ "country": regex });
        if (trips.length == 0) {
            req.flash('error', 'No countries match that query, please try again.');
            return res.redirect('/trips')
        }
        res.render('trips/index', { trips });
    } else {
        const trips = await Trip.find({});
        res.render('trips/index', { trips });
    }
}

module.exports.renderNewForm = (req, res) => {
    res.render('trips/new');
}

module.exports.createTrip = async (req, res, next) => {
    const trip = new Trip(req.body.trip);
    trip.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    trip.lastUpdate = lastUpdate();
    console.log(req.user._id);
    trip.author = req.user._id;
    await trip.save();
    req.flash('success', 'Successfully made a new trip!');
    res.redirect('/trips');
}

module.exports.showTrip = async (req, res) => {
    const trip = await Trip.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!trip) {
        req.flash('error', 'Cannot find that trip!');
        return res.redirect('/trips')
    }
    res.render('trips/show', { trip });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) {
        req.flash('error', 'Cannot find that trip!');
        return res.redirect('/trips')
    }
    res.render('trips/edit', { trip });
}

module.exports.updateTrip = async (req, res) => {
    const { id } = req.params;
    const trip = await Trip.findByIdAndUpdate(id, { ...req.body.trip });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    trip.images.push(...imgs);
    trip.lastUpdate = lastUpdate();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) { // delete images from cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        await trip.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }); // delete images from db
    }
    await trip.save();
    req.flash('success', 'Successfully updated trip!');
    res.redirect(`/trips/${trip._id}`);
}

module.exports.deleteTrip = async (req, res) => {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted trip!');
    res.redirect('/trips');
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};