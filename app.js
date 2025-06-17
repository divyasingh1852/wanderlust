// if(process.env.NODE_ENV != "production") {   
//   require('dotenv').config();               //image upload -> npm i dotenv
// }
// console.log(process.env.SECRET);

// require('dotenv').config({ path: './.env' });
// console.log(process.env.SECRET);

// 
require('dotenv').config();
console.log("Loaded MAP_TOKEN:", process.env.MAP_TOKEN);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");  //for handling express errr
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");           // install-  npm i passport 
const LocalStrategy = require("passport-local"); //install- npm i passport-local
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");                           //npm i ejs
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));           //to access data directly from req.body or req.params                               
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);




//const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL;

main()
   .then((res) =>{
     console.log("connection successful");
   })
   .catch((err) => {
    console.log(err);
  });



async function main() {
  await mongoose.connect(dbUrl);      //wanderlust database
}





const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,       //sec
});


store.on("error", () => {
     console.log("ERROR in MONGO SESSION STORE", err);
});



//Express Sessions
const sessionOptions = {
    store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  //ek hafte baad (in millisecond)
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    },
};


// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });





//implement session and flash
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");  //note: local variables are accessible everywhere
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


// app.get("/demouser", async(req, res) => {
//      let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "delta-student",
//      });
//      let registeredUser = await User.register(fakeUser, "helloworld");
//      res.send(registeredUser);
// });



//Routes Section
app.get("/", (req, res) => {
   res.redirect("/listings");
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);







//Error handling middlewares(custom error/express error)

app.all("*", (req, res, next) => {
     next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("server is listening on port 8080");
});

































