const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const {createNewReview, deleteReview} = require("../controllers/reviews");

router.post("/", validateReview, isLoggedIn, catchAsync(createNewReview));

router.delete("/:reviewsId", isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;