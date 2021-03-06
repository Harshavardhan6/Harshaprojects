var express  = require("express");
var router   = express.Router();
var Campground = require("../models/campground");

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
router.post("/campgrounds", isLoggedIn, function(req, res){
   var name=req.body.name; 
   var image=req.body.image;
   var desc=req.body.description;
   var author= {
       id: req.user._id,
       username:req.user.username
   };
   var newCampground={name:name, image:image, description:desc, author:author};
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
router.get("/campgrounds/new", isLoggedIn, function(req, res){
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
       return next(); 
    }
    res.redirect("/login");
}


module.exports = router;