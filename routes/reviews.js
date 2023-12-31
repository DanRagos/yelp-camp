const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review')
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError');
const catchAsync = require ('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware/middleWare')
const reviews = require('../controllers/review');




router.post('/', isLoggedIn,  validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,  catchAsync(reviews.deleteReview));


module.exports = router;