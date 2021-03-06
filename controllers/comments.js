const Trip = require('../models/trip');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const trip = await Trip.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    trip.comments.push(comment);
    await comment.save();
    await trip.save();
    req.flash('success', 'Created new comment!');
    res.redirect(`/trips/${trip._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Trip.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted trip!');
    res.redirect(`/trips/${id}`);
}