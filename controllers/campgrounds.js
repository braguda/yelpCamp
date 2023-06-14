const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.getAll = async(req, res) => {
    let campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
}

module.exports.displayOne = async(req, res, next) => {
    try{
        let foundCamp = await Campground.findById(req.params.id).populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        }).populate("author");
        if(!foundCamp) {
            req.flash("error", "Invalid Query");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", {foundCamp});
    } catch(error){
        next(error);
    }
};

module.exports.createNewCampground = async(req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    let newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(file => ({url: file.path, filename: file.filename}));
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp);
    req.flash("success", "New campground created");
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.newCampForm = async(req, res) => {
    let campgrounds = await Campground.find({});
    res.render("campgrounds/new", {campgrounds})
};

module.exports.editCampForm = async(req,res) => {
    let foundCamp = await Campground.findById(req.params.id);
    if(!foundCamp) {
        req.flash("error", "Invalid Query");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {foundCamp});
};

module.exports.updateCampground = async(req, res) => {
    let updatedCamp = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    console.log(req.body);
    let imgs = req.files.map(file => ({url: file.path, filename: file.filename}));
    updatedCamp.images.push(...imgs);
    if(req.body.deleteImages){
        for(let i of req.body.deleteImages){
            await cloudinary.uploader.destroy(i)
        }
        await updatedCamp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(updatedCamp);
    }
    await updatedCamp.save();
    req.flash("success", "Campground updated");
    res.redirect(`/campgrounds/${updatedCamp._id}`)
};

module.exports.deleteCampground = async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground Removed");
    res.redirect("/campgrounds");
};

