require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const MongoStore = require("connect-mongo");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

const dbUrl = process.env.ATLAS_DB_URL;
// const localUrl="mongodb://127.0.0.1:27017/wanderlust" if use local database 

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret:process.env.SECRETE },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("Error in session code");
});

let sessionOption = {
  store,
  secret: process.env.SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




main()
  .then(() => {
    console.log("Success..to connection");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/", (req, res) => {
//   res.send("Home route..");
// });

app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Routes all listings
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//Page not found Middleware
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Middleware Error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listing/error.ejs", { message });
});

app.listen(port, () => {
  console.log(`server runing on ${port}`);
});

// Demo Route
// app.get("/demo",async(req,res)=>{
//   let fakeData=new User({
//     email:"my@gmail.com",
//     username:"My-apna"
//   })
//   let register=await User.register(fakeData,"helloworld");
//   res.send(register);
// })
