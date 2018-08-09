var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var seedDB= require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp");


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
         res.render("index", {campgrounds:allCampgrounds});  
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
   res.render("new");
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
           res.render("show", {campground:foundCampground});
        }
    });
    
    
});





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
})