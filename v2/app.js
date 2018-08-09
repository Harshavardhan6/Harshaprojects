var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

// Schema Setup

var campgroundSchema= new mongoose.Schema({
  name  : String,
  image : String,
  description: String
});

var Campground= mongoose.model("Campground", campgroundSchema );

// Campground.create(
//     {
//     name:"Mountain Goat's Rest", 
//     image:"https://cdn.pixabay.com/photo/2017/09/26/13/50/rv-2788677__340.jpg",
//     description: "This is a Beautiful location but no Washrooms, no water"
//     }, function(err, campground){
//       if(err){
//           console.log(err);
//       } else{
//           console.log("Newly Created Campground: ");
//           console.log(campground);
//       }
//     });


// var campgrounds=[
//     {name:"Salmon Creek", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104497f9c27ca0e8b5bc_340.jpg"},
//     {name:"Granite Hill", image:"https://pixabay.com/get/eb37b9082df3003ed1584d05fb1d4e97e07ee3d21cac104497f9c27ca0e8b5bc_340.jpg"},
//     {name:"Mountain Goat's Rest", image:"https://pixabay.com/get/eb30b90e2af0033ed1584d05fb1d4e97e07ee3d21cac104497f9c27ca0e8b5bc_340.jpg"},
//     ] ;

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
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
           // render show template with that campground 
           res.render("show", {campground:foundCampground});
        }
    })
    
    
});





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
})