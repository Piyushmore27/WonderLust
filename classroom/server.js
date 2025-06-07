const express = require("express");
const app = express();

const users = require("./routes/user.js");



app.get("/",(req,res)=>{
    res.send("Hi i am root");
});

app.use("/users",users);


//Posts
//Index route
app.get("/posts",(req,res)=> {
    res.send("GET for posts");
});

//show 
app.get("/posts/:id",(req,res)=> {
    res.send("GET for posts id ");
});

//Post 
app.get("/posts",(req,res)=> {
    res.send("POST for posts");
});


//Delete 
app.delete("/posts/:id",(req,res)=> {
    res.send("Delete for posts");
});


app.listen(3000 ,()=> {
    console.log("server is listening to port 3000");
});