const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateComment, isLoggedIn, isReviewAuthor } = require('../middleware');
const comments = require('../controllers/comments');

router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));

router.delete('/:commentId', isLoggedIn, isReviewAuthor, catchAsync(comments.deleteComment));

module.exports = router;