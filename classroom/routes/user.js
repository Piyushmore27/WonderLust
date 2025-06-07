const express = require("express");

const router = express.Router();



//Index route
router.get("/users",(req,res)=> {
    res.send("GET for users");
});

//show user
router.get("/user/:id",(req,res)=> {
    res.send("GET for users id ");
});

//Post route
router.get("/users",(req,res)=> {
    res.send("POST for users");
});


//Delete route
router.delete("/user/:id",(req,res)=> {
    res.send("Delete for users");
});

module.exports = router;