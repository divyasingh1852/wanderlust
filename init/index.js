const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
   .then((res) =>{
     console.log("connection successful");
   })
   .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);      //wanderlust database
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj, 
      owner: "6841b6f1fff511779d9519d4",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};


initDB();







































