const express  = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {vaildateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
// reviews post route
router.post("/",isLoggedIn, vaildateReview, 
    wrapAsync(reviewController.createReview)
);

// Delete route for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, 
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;

