const User = require("../models/user.js");


 module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
};




module.exports.signup = async (req, res, next) => {
 try {
   let { username, email, password } = req.body;
   const existingEmailUser = await User.findOne({ email });
   if(existingEmailUser){
    req.flash("error", "Email already exists. Please log in!");
    return res.redirect("/login"); }               
   const newUser = new User({email, username});
   const registeredUser = await User.register(newUser, password);
   console.log(registeredUser);
   req.login(registeredUser, (err) => {
     if(err) {
      return next(err);
     }
      req.flash("success", "welcome to wanderlust!");
      res.redirect("/listings");
   });
   } catch(e) {
     req.flash("error", e.message);
     res.redirect("/signup");
   }
};




 module.exports.renderLoginForm = (req, res) => {
        res.render("./users/login.ejs");
 };





 module.exports.login = async (req, res) => {
       req.flash("success", "Welcome back to Wanderlust!");
       let redirectUrl = res.locals.redirectUrl || "/listings";
       res.redirect(redirectUrl);
};





module.exports.logout = (req, res, next) => {
  req.logout((err) => {
      if(err){
        return next(err);
      }
     req.flash("success", "you are logged out!");
     res.redirect("/listings");
    });
};




























































