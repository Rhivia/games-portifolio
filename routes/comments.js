var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");
    
    
//============================
//  COMMENTS ROUTES
//============================

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err); 
            res.redirect("/campgroundsPage");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if(err){
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgroundsPage/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id, 
                comment: foundComment
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgroundsPage/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Commment deleted.");s
            res.redirect("/campgroundsPage/" + req.params.id);
        }
    });
});

module.exports = router;