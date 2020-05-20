var express = require("express"),
  bodyParser = require("body-parser"),
  multer = require("multer"),
  mongoose = require("mongoose");
passport = require("passport"),
  LocalStrategy = require("passport-local"),
  AdminUser = require("./models/adminUser")
// alertify = require("alertifyjs");




//App Setting
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: __dirname + "/public/uploads/images" });


//password config
app.use(require("express-session")({
  secret: "Skylivings is best website!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(AdminUser.authenticate()));
passport.serializeUser(AdminUser.serializeUser());
passport.deserializeUser(AdminUser.deserializeUser());


// mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
// mongoose.connect("mongodb://localhost/skytest");
mongoose.connect('mongodb+srv://skylivingweb:Felix2020@@cluster0-jgx9s.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to DB!');
}).catch(err => {
  console.log('ERROR:', err.message);
});


// ########################################################
// ##
// ##                 Room Schema
// ##
// ########################################################


var roomSchema = new mongoose.Schema({
  propName: String,
  propLocation: String,
  propAddress: String,
  propSize: Number,
  propLat: Number,
  propLong: Number,
  propRooms: Number,
  propOccupancy: Array,
  propCooling: Array,
  propPrice: Array,
  propImgExt: String,
  propImg1: String,
  propImag2: String,
  propImg3: String,
  propFeatures: Array,
  propDate: { type: Date, default: Date.now },
});
var Room = mongoose.model("Room", roomSchema);


// ########################################################
// ##
// ##                 Query Schema
// ##
// ########################################################


var querySchema = new mongoose.Schema({
  queryName: String,
  queryPhone: Number,
  queryMessage: String,
  queryDate: { type: Date, default: Date.now },
});
var Query = mongoose.model("Query", querySchema);

Room.countDocuments({}, function (err, count) {
  if (err) {
    console.log(err);
  } else {
    total = count;
  }
});

//App Routes
app.get("/", function (req, res) {
  Room.find({}, function (err, room) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { featured: room });
    }
  });

});

app.get("/rooms/:id", function (req, res) {
  Room.findById(req.params.id, function (err, foundroom) {
    if (err) {
      res.render("/home");
    }
    else {
      res.render("room", { room: foundroom });
    }
  });
});

app.get("/autocomplete", function (req, res, next) {
  var regex = new RegExp(req.query["term"], 'i');
  var roomsearch = Room.find({ propName: regex }, { 'propName': 1 }).limit(20);
  roomsearch.exec(function (err, data) {

    var result = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach(pg => {
          let obj = {
            id: pg._id,
            label: pg.propName
          };
          result.push(obj);
        });
      }

      res.jsonp(result);
    }
  });
});

app.get('/rooms', paginatedResults(Room), (req, res) => {
  let room = res.paginatedResults.results
  res.render("roomlist", { normal: room })
})

app.post("/query", function (req, res) {
  Query.create({
    queryName: req.body.queryName,
    queryPhone: req.body.queryPhone,
    queryMessage: req.body.queryMessage,
    propFeatures: req.body.propFeatures
  });
  res.render("admin_room_new", { topbarHeading: "Add New Property" })
});


//**************** Admin Routes ********************

app.get("/admin/register", function (req, res) {
  res.render("admin_register");
});

app.post("/admin/register", function (req, res) {
  var adminUser = new AdminUser({ username: req.body.username });
  AdminUser.register(adminUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("admin_register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/admin/home");
    });
  });
});

app.get("/admin/login", function (req, res) {
  res.render("admin_login");
});

app.post("/admin/login", passport.authenticate("local",
  {
    successRedirect: "/admin",
    failureRedirect: "/admin/login"
  }), function (req, res) {
  });

app.get("/admin/logout", function (req, res) {
  req.logout();
  res.redirect("/home");
});


//Admin home Route
app.get("/admin", function (req, res) {
  res.render("admin_home", { topbarHeading: "Dashboard", roomCount: total });
});
//Index Rooms
app.get("/admin/rooms", function (req, res) {
  Room.find({}, function (err, room) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin_room_index", { topbarHeading: "Property List", rooms: room });
    }
  });

});

// New Route

app.get("/admin/rooms/new", function (req, res) {
  res.render("admin_room_new", { topbarHeading: "Add New Property" });
});

app.post("/createRooms", upload.fields([
  { name: 'propImgExt', maxCount: 1 },
  { name: 'propImg1', maxCount: 1 },
  { name: 'propImg2', maxCount: 1 },
  { name: 'propImg3', maxCount: 1 }
]), function (req, res) {
  Room.create({
    propName: req.body.propName,
    propLocation: req.body.propLocation,
    propAddress: req.body.propAddress,
    propSize: req.body.propSize,
    propLat: req.body.propLat,
    propLong: req.body.propLong,
    propRooms: req.body.propRooms,
    propOccupancy: req.body.propOccupancy,
    propCooling: req.body.propCooling,
    propPrice: req.body.propPrice,
    propImgExt: req.files.propImgExt[0].filename,
    propImg1: req.files.propImg1[0].filename,
    propImag2: req.files.propImg2[0].filename,
    propImg3: req.files.propImg3[0].filename,
    propFeatures: req.body.propFeatures
  });
  res.render("admin_room_new", { topbarHeading: "Add New Property" })
});


app.get("/contact", function (req, res) {
  res.render("contact")
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}


//App Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
