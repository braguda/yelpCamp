const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const {loadRegisterForm, registerUser, loadLoginForm, loginUser, logout} = require("../controllers/users");

router.route("/register")
    .get(loadRegisterForm)
    .post(catchAsync(registerUser));

router.route("/login")
    .get(loadLoginForm)
    .post(passport.authenticate("local", {
        failureFlash: true, 
        failureRedirect: "/auth/login",
        keepSessionInfo: true
    }), loginUser);

router.get("/logout", logout);

module.exports = router;