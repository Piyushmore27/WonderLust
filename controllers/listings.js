
const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{ 
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=> {
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
};

module.exports.createListing = async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};


module.exports.editForm = async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Not found!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{ listing });
};

module.exports.updateListing = async (req, res) => {
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
};

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
};