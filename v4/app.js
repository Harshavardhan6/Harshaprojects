var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var seedDB= require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp_v3");


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("landing"); 
});


// INDEX route- Shows all Campgrounds
app.get("/campgrounds", function(req, res){
    // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else{
         res.render("campgrounds/index", {campgrounds:allCampgrounds});  
       }
   });
});


// CREATE route- add new campground to DB
app.post("/campgrounds", function(req, res){
   var name=req.body.name; 
   var image=req.body.image;
   var desc=req.body.description;
   var newCampground={name:name, image:image, description:desc};
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
         res.redirect("/campgrounds");  
       }
   });
   
   
});

// NEW route- displays form to create a new campground
app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new");
});


// SHOW route- displays more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

// ==========================================================
//  Comments Routes
// ==========================================================
 
 app.get("/campgrounds/:id/comments/new", function(req, res){
    //  find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground:campground});
        }
    })
     
 });
 
 app.post("/campgrounds/:id/comments", function(req, res){
    // look up campground using id
    Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err)
          res.redirect("/campgrounds");
      }  else {
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  campground.comments.push(comment);
                  campground.save();
                  res.redirect('/campgrounds/'+ campground._id);
              }
          })
      }
    });
    // create a new comment
    // connect new comment to campground
    // redirct to campground show page
 });



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
})