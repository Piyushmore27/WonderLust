const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/WonderLust";

main().then(()=>{
    console.log("connected to database");
}).catch(err=>{
    console.log(err);
});


async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68556e7673678590be6641ef"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initilized");

};

initDB();
