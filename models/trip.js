const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    images: [
        {
            url: String,
            filename: String
        }
    ],
    country: String,
    numOfDays: Number,
    startCity: String,
    endCity: String,
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