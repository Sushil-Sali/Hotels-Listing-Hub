const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError =require("./utils/ExpressError")

module.exports.isLogedin = async (req, res, next) => {
  // console.log(req.user)
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be loged in !");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = async (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not author this review !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Schema to  conert middlewere
// Joi validation for listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(error)
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Reviewv Middleware
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
