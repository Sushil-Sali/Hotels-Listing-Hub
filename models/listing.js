const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Review = require("./review.js");

listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: String,
    url: String,
  },
  //   image: {
  //     type: String,
  //     default:"https://imgs.search.brave.com/GTIjFM6PqIXl38TQ9eHFghyJG3OuzVXIhbbTVI8I0PQ/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9yb29t/cy1iYXNpYy5ib3Nu/aWEtaGVyemVnb3Zp/bmEuaW5mby9kYXRh/L1Bob3Rvcy8xNTB4/MTUwdy8xMjQ5NS8x/MjQ5NTY4LzEyNDk1/NjgwNzEvcm9vbXMt/YmFzaWMtYmxhZ2Fq/LXBob3RvLTUuSlBF/Rw",
  //     set:(v)=>
  //         v===""?"https://imgs.search.brave.com/GTIjFM6PqIXl38TQ9eHFghyJG3OuzVXIhbbTVI8I0PQ/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9yb29t/cy1iYXNpYy5ib3Nu/aWEtaGVyemVnb3Zp/bmEuaW5mby9kYXRh/L1Bob3Rvcy8xNTB4/MTUwdy8xMjQ5NS8x/MjQ5NTY4LzEyNDk1/NjgwNzEvcm9vbXMt/YmFzaWMtYmxhZ2Fq/LXBob3RvLTUuSlBF/Rw"
  //         :v
  // },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
//Delete middleware

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
