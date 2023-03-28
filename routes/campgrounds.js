const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const {getAll, displayOne, createNewCampground, newCampForm, editCampForm, updateCampground, deleteCampground} = require("../controllers/campgrounds");
const multer = require("multer");
const {storage} = require("../cloudinary/index");
const upload = multer({storage});


router.route("/")
    .get(catchAsync(getAll))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(createNewCampground));

router.get("/new", isLoggedIn, newCampForm);

router.route("/:id")
    .get(catchAsync(displayOne))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(updateCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(editCampForm));

router.delete("/:id/delete", isLoggedIn, isAuthor, catchAsync(deleteCampground));



module.exports = router;