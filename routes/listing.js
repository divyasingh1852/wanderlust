const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");  //for custom error handling
const Listing =  require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require('multer')  //npm i multer  -> for uploading images
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage });


const listingController = require("../controllers/listings.js");




//Router.route


//index route & create route
router 
 .route("/")
 .get(wrapAsync(listingController.index))
 .post(
    isLoggedIn, 
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.createListing)
);



//New Route  (note: new will be above then show)
router.get("/new", isLoggedIn, listingController.renderNewForm);




//show,update and delete route
router.route("/:id")            
 .get(wrapAsync(listingController.showListing))
 .put(
     isLoggedIn, 
     isOwner, 
     upload.single('listing[image]'),
     validateListing, 
     wrapAsync(listingController.updateListing)
  )
  .delete(
     isLoggedIn, 
     isOwner, 
     wrapAsync(listingController.destroyListing)
  );



//Edit Route
router.get(
    "/:id/edit", 
     isLoggedIn, 
     isOwner, 
     wrapAsync(listingController.renderEditForm)
);







//above code is more simple code 

//Index Route
// router.get( "/", wrapAsync(listingController.index));



//New Route  (note: new will be above then show)
//router.get("/new", isLoggedIn, listingController.renderNewForm);



//Show Route
// router.get("/:id", wrapAsync(listingController.showListing));



//create Route
// router.post(
//     "/", 
//     isLoggedIn, 
//     validateListing, 
//     wrapAsync(listingController.createListing)
// );


//Edit Route
// router.get(
//     "/:id/edit", 
//      isLoggedIn, 
//      isOwner, 
//      wrapAsync(listingController.renderEditForm)
// );



//Update Route
// router.put(
//     "/:id", 
//      isLoggedIn, 
//      isOwner, 
//      validateListing, 
//      wrapAsync(listingController.updateListing)
// );




//Delete Route
// router.delete(
//     "/:id", 
//      isLoggedIn, 
//      isOwner, 
//      wrapAsync(listingController.destroyListing)
// );




module.exports = router;










































