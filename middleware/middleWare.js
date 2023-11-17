const Campground = require('../models/campground');
const {campgroundSchema, reviewSchema} = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review')

const validateCampground = ((req, res, next)=> {
    const {error} = campgroundSchema.validate(req.body);   
    if (error) {
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
});

const isLoggedIn = (req, res, next) => {
    console.log("User", req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must logged in!');
        return res.redirect('/login')
    }
    next();
}

const storeReturnTo =  (req, res, next) => {
    if (req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
        console.log('ReturnTo set:', req.session.returnTo);
    }
    next();
}

const isAuthor = async (req, res, next)=> {
    const {id }= req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'Unauthorized!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const isReviewAuthor = async (req, res, next)=> {
    const {id, reviewId }= req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'Unauthorized!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateReview = (req, res, next)=> {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


module.exports = {validateCampground, isLoggedIn, storeReturnTo, isAuthor, validateReview, isReviewAuthor};

