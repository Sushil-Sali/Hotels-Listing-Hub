const mongoose=require('mongoose');
const initData=require('./data.js');
const Listing=require("../models/listing.js");

main()
  .then(() => {
    console.log("Success..to connection");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async()=>{
  
    initData.data = initData.data.map((obj)=>({...obj,owner:"68c9a1dc3b6d7a93e86000f0"}))
    await Listing.insertMany(initData.data)
    console.log("data was iniilized....")
}

initDB()