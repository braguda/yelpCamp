const Campground = require("./models/campground");
const Review = require("./models/reviews");
const expressError = require("./utils/expressError");
const {campgroundJoiSchema, reviewsJoiSchema} = require("./schemas");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Log in to access");
        return res.redirect("/auth/login");
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    let {id} = req.params;
    let foundCamp = await Campground.findById(id);
    if(!foundCamp.author.equals(req.user._id)) {
        req.flash("error", "You can't touch that!");
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewsId } = req.params;
    let review = await Review.findById(reviewsId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You can't touch that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {

    let {error} = campgroundJoiSchema.validate(req.body)
    if(error){
        let msg = error.details.map(element => element.message).join(",")
        throw new expressError(msg, 400)
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewsJoiSchema.validate(req.body);
    if(error){
        let msg = error.details.map(element => element.message).join(",");
        throw new expressError(msg, 400);
    }else{
        next();
    }
};