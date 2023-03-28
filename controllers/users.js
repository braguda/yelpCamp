const User = require("../models/user");
const passport = require("passport");

module.exports.loadRegisterForm = (req, res) => {
    res.render("auth/register");
}

module.exports.registerUser = async(req, res) => {
    try{
        let {email, username, password} = req.body;
        let input = new User({email, username});
        let newUser = await User.register(input, password);
        req.login(newUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Information Registered");
            res.redirect("/campgrounds/");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("register");
    }
};

module.exports.loadLoginForm = (req, res) => {
    res.render("auth/login");
};

module.exports.loginUser = (req, res) => {
    let {username} = req.body;
    req.flash("success", `Welcome back, ${username}!`);
    let startingUrl = req.session.returnTo || "/campgrounds/";
    delete req.session.returnTo;
    res.redirect(startingUrl);
};

module.exports.logout=  (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You have logged out");
        res.redirect("/campgrounds");
    });
};
