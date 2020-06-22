var express                 = require("express"),
    router                  = express.Router(),
    User                    = require("../models/user"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local");
    
//==================================
//      ROUTES - HOME
router.get("/", function (req, res) {
    res.render("landing");
    //res.redirect("/campgroundsPage");
});

//===============================
//          AUTH ROUTES
//===============================

// Register form
router.get("/register", function(req, res) {
    res.render("campgrounds/register");
});

// Handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function (err, user) {
        if(err){
            req.flash("error", err.message);
            return res.render("campgrounds/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("info", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgroundsPage");
        });
    });
});

//===============================
//          LOGIN ROUTES
//===============================

router.get("/login", function(req, res) {
    res.render("campgrounds/login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgroundsPage",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("info", "Logged you out!");
    res.redirect("/campgroundsPage");
});

module.exports = router;