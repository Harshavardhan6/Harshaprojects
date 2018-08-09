var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");
var User          = require("./models/user");
var seedDB        = require("./seeds");

var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes       = require("./routes/auth");

// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v8");


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

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});