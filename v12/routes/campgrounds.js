var express  = require("express");
var router   = express.Router();
var Campground = require("../models/campground");
var middleware= require("../middleware");
// var methodOverride= require("method-override");

// INDEX route- Shows all Campgrounds
router.get("/campgrounds", function(req, res){
    // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else{
         res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});  
       }
   });
});


// CREATE route- add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
   var name=req.body.name; 
   var price=req.body.price; 
   var image=req.body.image;
   var desc=req.body.description;
   var author= {
       id: req.user._id,
       username:req.user.username
   };
   var newCampground={name:name, price:price, image:image, description:desc, author:author};
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           console.log(newlyCreated);
         res.redirect("/campgrounds");  
       }
   });
});

// NEW route- displays form to create a new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new");
});


// SHOW route- displays more info about one campground
router.get("/campgrounds/:id", function(req, res){
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
           // render show template with that campground 
           res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
           res.render("campgrounds/edit", {campground: foundCampground}); 
    });
});
// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if (err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;