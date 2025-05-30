const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLust";

main().then(()=>{
    console.log("connected to database");
}).catch(err=>{
    console.log(err);
});


async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.get("/",(req,res)=> {
    res.send("hi i am root");
});



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


//index route

app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));
//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync(async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
}));



//create route
app.post("/listings",vaildateListing,
    wrapAsync(async(req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
    }
));


//edit route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=> {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
}));

//update route 
app.put("/listings/:id",vaildateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delte route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));












// app.get("/testListings",async(req,res)=>{
//    let sampleListing = new Listing ({
//     title: "My new cruies",
//     description: "By the beach",
//     price: 1000000,
//     location: "Goa",
//     country: "india"
//    });

//    await sampleListing.save();
//    console.log("sample was save");
//    res.send("Succesful testing");

// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
});



app.use((err, req, res, next)=>{
    let {statusCode=500, message = "something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    
});



app.listen(8080, ()=> {
    console.log("Server is listening to port 8080")
});