// Variables - requires.
let express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash"),

    // Seeds
    seedDB              = require("./seeds"),

    // Authentication
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),

    // Mongoose Schemas
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),

    // Routes
    indexRoutes         = require("./routes/index"),
    commentRoutes       = require("./routes/comments"),
    campgroundsRoutes   = require("./routes/campgrounds");

// console.log(process.env.DATABASEURL);

// Variables set.
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true}); // HOMOLOG
//mongoose.connect("mongodb://va11:11EpicMoon@ds123562.mlab.com:23562/yelpcamphalla", {useNewUrlParser: true}); // PROD

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Populate database with data
//seedDB();

// Passport configuration
app.use(require("express-session")({
    secret:"Hacking the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// User information distribution
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    next();
});

//  Set files with routes to be used.
app.use(indexRoutes);
app.use("/campgroundsPage/:id/comments/", commentRoutes);
app.use("/campgroundsPage/", campgroundsRoutes);

app.get("*", function(req, res) {
    res.send("Page not found.");
});

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server Start.");
});
