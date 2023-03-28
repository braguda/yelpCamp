const Review = require("../models/reviews");
const Campground = require("../models/campground");


module.exports.createNewReview = async(req, res) => {
    let foundCamp = await Campground.findById(req.params.id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    foundCamp.reviews.push(newReview);
    await newReview.save();
    await foundCamp.save();
    req.flash("success", "Review Posted");
    res.redirect(`/campgrounds/${foundCamp._id}`);
};

module.exports.deleteReview =  async(req, res) => {
    let { id, reviewsId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewsId}})
    await Review.findByIdAndDelete(reviewsId);
    req.flash("success", "Review Deleted")
    res.redirect(`/campgrounds/${id}`);
}