const Listing = require("../models/listing.js");





// Display all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};




module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};




module.exports.showListing = async( req, res) => {
     let { id } = req.params;
     const listing = await Listing.findById(id)
       .populate({
          path: "reviews",
          populate: {
           path: "author",
         },
      })
      .populate("owner");
     if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
     }
     console.log(listing);
     res.render("listings/show.ejs", { listing });
};







module.exports.createListing = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("File upload required.");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Geocoding Implementation
    const locationQuery = encodeURIComponent(req.body.listing.location || "");
    const geoApiUrl = `https://api.maptiler.com/geocoding/${locationQuery}.json?key=${process.env.MAP_TOKEN}`;

    const response = await fetch(geoApiUrl);
    
    if (!response.ok) {
      throw new Error(`Geocoding request failed with status: ${response.status}`);
    }

    const responseBody = await response.json();

    // Validate the geocoding response
    if (responseBody.features?.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: responseBody.features[0].geometry.coordinates,
      };
    } else {
      console.warn("Geocoding failed: No valid coordinates returned. Using fallback.");
      newListing.geometry = {
        type: "Point",
        coordinates: [77.209, 28.6139], // Default fallback (New Delhi)
      };
    }

    // Save listing and verify success
    let savedListing = await newListing.save();
    console.log("Successfully saved listing:", savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
};








module.exports.renderEditForm = async (req, res, next) => {
     let { id } = req.params;
     const listing = await Listing.findById(id);
     if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
     }

     let originalImageUrl = listing.image.url;
     originalImageUrl.replace("/upload", "/upload/w_250");
     res.render("listings/edit.ejs", {listing, originalImageUrl});
};













module.exports.updateListing = async (req, res, next) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing});

    if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = { url, filename };
    await listing.save();
  }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};












module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};


































































