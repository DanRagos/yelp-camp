const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async(req, res)=> {
    const campground = await Campground.findById(req.params.id);
    //console.log(campground)
    const review = new Review (req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review');
    res.redirect(`/campgrounds/${req.params.id}`)
};

module.exports.deleteReview = async(req, res, next )=> {
    const {id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}


