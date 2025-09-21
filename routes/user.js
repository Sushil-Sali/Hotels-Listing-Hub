const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js")

//SignUp Form
router.get("/signup",userController.renderSignupForm);

// Add To DB
router.post(
  "/signup",
  wrapAsync(userController.userSignup)
);

//Login form

router.get("/login",userController.renderLoginForm);

// login to check use
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.userLogin
);

//LogOut
router.get("/logout",userController.userLogout );

module.exports = router;
