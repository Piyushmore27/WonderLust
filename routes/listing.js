const express  = require("express");
const { rout } = require("../classroom/routes/user");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

const {vaildateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//index approute

router.get("/",wrapAsync(listingController.index));




//new route
router.get("/new", isLoggedIn ,listingController.renderNewForm);






//show route
router.get("/:id", 
    wrapAsync(listingController.showListing));



//create route
router.post("/",vaildateListing, isLoggedIn,
    wrapAsync(listingController.createListing));


//edit route
router.get("/:id/edit", isLoggedIn ,isOwner,
    wrapAsync(listingController.editForm));

//update route 
router.put("/:id",isLoggedIn,isOwner, vaildateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner,
    wrapAsync(listingController.deleteListing));


module.exports = router;