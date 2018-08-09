var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var Campground=require("./models/campground");
var Comment=require("./models/comment");
var User=require("./models/user");
var seedDB= require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v6");


app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Passport configuration
app.use(require("express-session")({
    secret:"Some random text",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


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
         res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});  
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
 
 app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //  find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground:campground});
        }
    })
     
 });
 
 app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
    // look up campground using id
    Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err)
          res.redirect("/campgrounds");
      }  else {
          // create a new comment
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              } else {
                  // connect new comment to campground
                  campground.comments.push(comment);
                  campground.save();
                  // redirct to campground show page
                  res.redirect('/campgrounds/'+ campground._id);
              }
          })
      }
    });
 });

// =======================
// Authentication routes
// =======================

// show register form
app.get("/register", function(req, res) {
    res.render("register");
});

// handle signup logic
app.post("/register", function(req, res) {
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
          res.redirect("/campgrounds"); 
       });
    });
});

// show login form
app.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}), function(req, res) {
});

// logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
       return next(); 
    }
    res.redirect("/login");
}









app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});