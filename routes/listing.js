require("dotenv").config();
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLogedin, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index route
router.get("/", wrapAsync(listingController.index));

// Add new listing
router.get("/new", isLogedin, wrapAsync(listingController.renderNewForm));

// Show route
router.get("/:id", wrapAsync(listingController.showListing));

//create new information
router.post(
  "/",
  isLogedin,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

//Edit route
router.get("/:id/edit", isLogedin, wrapAsync(listingController.renderEditForm));

// Update route
router.put(
  "/:id",
  isLogedin,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete("/:id", isLogedin, wrapAsync(listingController.destroyListing));

module.exports = router;
