const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

// virtual properties can be added only to a schema
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const tripSchema = new Schema({
    images: [ImageSchema],
    country: String,
    numOfDays: Number,
    startCity: String,
    endCity: String,
    daysSchedule: [
        {
            picture: String,
            program: String
        }
    ],
    lastUpdate: Date,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

// query middleware
// when a trip is deleted all the related comments will be deleted.
tripSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Trip', tripSchema);