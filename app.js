if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const mongoose = require("mongoose");
const campgroundRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const authRoutes = require("./routes/authenticate");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const MongoStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelpCamp"

app.engine("ejs", ejsMate);

app.use(bodyParser.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true})
.then(() => {
    console.log("Connection Open!!!");
})
.catch(err => {
    console.log("Oh NO ERROR!!!!", err)
});

const secret = process.env.SECRET || "bikininottom"

const store = new MongoStore({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(error){
    console.log("sesstion store error: ", error);
})

const sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60,
        maxAge: 1000 * 60 * 60
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/auth", authRoutes);


app.get("/", (req, res) => {
    res.render("index");
});

app.all("*", (req, res, next) => {
    next(new expressError("Page Not Found", 404))
});

app.use((error, req, res, next) => {
    const {statusCode = 500} = error;
    if(!error.message) error.message = "Oh no! I'm too big and you're so tight!"
    res.status(statusCode).render("errors", {error});
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`app open on ${port}`);
});