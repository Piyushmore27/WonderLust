const express = require("express");
const app = express();
const session = require("express-session");
const users = require("./routes/user.js");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const sessionOptions = (
    {
        secret: "mysecretstring",
        resave: false,
        saveUninitialized: true,
    }
);


app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=> {
    let {name} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully!");
    res.redirect("/hello");
});

app.get("/hello",(req,res)=> {
    res.render("page.ejs",{name: req.session.name, msg: req.flash("success")});
});




app.get("/reqcount",(req,res)=> {
    if(req.session.count){
        req.session.count++;
    } else {
        req.session.count = 1;
    }

    res.send(`You sent a request ${req.session.count} times`)
});







// app.get("/test",(req,res)=> {
//     res.send("test succesful!");
// });















































































// app.get("/getsignedcookie",(req,res)=> {
//     res.cookie("madeIn", "norway", {signed: true});
//     res.send("signed cookies sent");
// });

// app.get("/verify", (req,res)=> {
//     console.log(req.signedCookies);
//     res.send("verified");
// });




// app.get("/getcookies",(req, res) => {
//     res.cookie("greet","hello");
//     res.send("sent you some cookies!");
// });


// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi i am root");
// });

// app.use("/users",users);


// //Posts
// //Index route
// app.get("/posts",(req,res)=> {
//     res.send("GET for posts");
// });

// //show 
// app.get("/posts/:id",(req,res)=> {
//     res.send("GET for posts id ");
// });

// //Post 
// app.get("/posts",(req,res)=> {
//     res.send("POST for posts");
// });


// //Delete 
// app.delete("/posts/:id",(req,res)=> {
//     res.send("Delete for posts");
// });


app.listen(3000 ,()=> {
    console.log("server is listening to port 3000");
});