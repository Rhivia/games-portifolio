var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

//==================================
//      ROUTES - CAMPGROUNDS
router.get("/", function (req, res) {
    // Get all campground from DB
    Campground.find({}, function (err, campgroundsDB) {
        if(err){console.log(err);} else {
            res.render("campgrounds/index", {
                campgroundsDB: campgroundsDB
            });
        }
    });
});

//==================================
//      ROUTES - CAMPGROUNDS NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/newCamp");
});

//==================================
//      ROUTES - SHOW
router.get("/:id", function(req, res) {
    // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if(err){console.log(err);} else {
            
            // Render show template with camps
            res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

//=======================================
//      ROUTES - ADD NEW CAMPGROUND TO DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to campgrounds array
    var campName = req.body.name, 
        campImage = req.body.image, 
        campDesc = req.body.description, 
        campPrice = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: campName, image: campImage, description: campDesc, author: author, price: campPrice}
    
    //Create a new campground and sabe to DB
    Campground.create(newCampground, function (err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect to campogrounds page
            res.redirect("/campgroundsPage/");
        }
    });
});

// Edit routes
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground });
    });
});

// Update routes
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    // Find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCamp) {
        if(err){
            res.redirect("/campgroundsPage/");
        } else {
            // Redirect to show page
            res.redirect("/campgroundsPage/" + req.params.id);
        }
    });
});

// Destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            res.redirect("/campgroundsPage/");
        } else {
            res.redirect("/campgroundsPage/");
        }
    });
});

module.exports = router;