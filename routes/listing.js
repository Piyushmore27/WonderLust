const express  = require("express");
const { rout } = require("../classroom/routes/user");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");

//schema validation middleware function

const vaildateListing = (req,res,next)=>{
    let{ error } = listingSchema.validate(req.body);

    if (error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
}



//index approute

router.get("/",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", 
    wrapAsync(async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{ listing });
}));



//create route
router.post("/",vaildateListing,
    wrapAsync(async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
    }
));


//edit route
router.get("/:id/edit",
    wrapAsync(async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
}));

//update route 
router.put("/:id",vaildateListing,
    wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delte route
router.delete("/:id",
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports = router;