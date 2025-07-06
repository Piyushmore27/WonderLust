const express  = require("express");
const { rout } = require("../classroom/routes/user");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

const {vaildateListing} = require("../middleware.js");


//index approute

router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));




//new route
router.get("/new", isLoggedIn ,(req,res)=>{ 
    res.render("listings/new.ejs");
});






//show route
router.get("/:id", 
    wrapAsync(async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path:"author"
            }
        }).populate("owner");
    if(!listing){
        req.flash("error","Listing Not found!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{ listing ,currUser: req.user});
}));



//create route
router.post("/",vaildateListing, isLoggedIn,
    wrapAsync(async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    }
));


//edit route
router.get("/:id/edit", isLoggedIn ,isOwner,
    wrapAsync(async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Not found!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ listing });
}));

//update route 
router.put("/:id",isLoggedIn,isOwner, vaildateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
        const listingData = req.body.listing;

    // Fix the nested image object
    const updatedData = {
        ...listingData,
        image: {
            url: listingData.image?.url || "" // handle undefined
        }
    };

    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}));


module.exports = router;