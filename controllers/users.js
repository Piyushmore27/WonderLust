
const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=> {
    res.render("users/signup");
};


module.exports.signup = async(req,res)=> {
    try {
        let {username, email, password} = req.body;
        const newUser = new User ({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=> {
            if(err) {
                return next(err);
            }
            req.flash("success", "welcome to WanderLust!");
            res.redirect("/listings");
        });
        
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=> {
    res.render("users/login");
};
module.exports.login = async(req,res)=> {
    req.flash("success","Welcome to WanderLust! You are Logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You are not Logged in!");
        return res.redirect("/login");
    } else {
        req.logOut((err) => {
            if(err){
                return next(err);
            }
            req.flash("success","you are logged out!");
            res.redirect("/listings");
        });
    };
};