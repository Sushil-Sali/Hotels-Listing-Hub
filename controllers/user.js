const User = require("../models/user");

module.exports.renderSignupForm = async (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.userSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To WanderLust !");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userLogin = async (req, res) => {
  req.flash("success", "Welocome Back WanderLust !");
  let newredirect = res.locals.redirectUrl || "/listings";

  console.log(newredirect);

  res.redirect(newredirect);
};

module.exports.userLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are loged out !");
    res.redirect("/listings");
  });
};
