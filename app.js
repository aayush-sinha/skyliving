var express = require("express"),
  bodyParser = require("body-parser"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  AdminUser = require("./models/adminUser"),
  Room = require("./models/rooms"),
  Query = require("./models/query");
middleware = require("./middleware");
// alertify = require("alertifyjs");

//App Setting
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(flash());
const PORT = process.env.PORT || 5000;
const upload = multer({ dest: __dirname + "/public/uploads/images" });


//passport config
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

app.use(function (req, res, next) {

  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
//Database Connection
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

app.get('/rooms', paginatedResults(Room, { propDate: 1 }), (req, res) => {
  let room = res.paginatedResults.results
  res.render("roomlist", { normal: room })
})

app.get('/roomlist/asc', paginatedResults(Room, { propPriceDisplay: 'ascending' }), (req, res) => {
  let room = res.paginatedResults.results
  res.render("roomlist", { normal: room })
})

app.get('/roomlist/desc', paginatedResults(Room, { propPriceDisplay: 'descending' }), (req, res) => {
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
  res.render("contact")
});


//**************** Admin Routes ********************

// app.get("/admin/register", function (req, res) {
//   res.render("admin_register");
// });

// app.post("/admin/register", function (req, res) {
//   var adminUser = new AdminUser({ username: req.body.username });
//   AdminUser.register(adminUser, req.body.password, function (err, user) {
//     if (err) {
//       console.log(err);
//       return res.render("admin_register");
//     }
//     passport.authenticate("local")(req, res, function () {
//       res.redirect("/admin/home");
//     });
//   });
// });

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
app.get("/admin", middleware.isLoggedIn, function (req, res) {
  res.render("admin_home", { topbarHeading: "Dashboard", roomCount: total });
});
//Index Rooms
app.get("/admin/rooms", middleware.isLoggedIn, function (req, res) {
  Room.find({}, function (err, room) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin_room_index", { topbarHeading: "Property List", rooms: room });
    }
  });

});

// New Route

app.get("/admin/rooms/new", middleware.isLoggedIn, function (req, res) {
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
    // propOccupancy: req.body.propOccupancy,
    // propCooling: req.body.propCooling,
    propPriceA1: req.body.propPriceA1,
    propPriceA2: req.body.propPriceA2,
    propPriceA3: req.body.propPriceA3,
    propPriceNA1: req.body.propPriceNA1,
    propPriceNA2: req.body.propPriceNA2,
    propPriceNA3: req.body.propPriceNA3,
    propPriceDisplay: req.body.propPriceDisplay,
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

function paginatedResults(model, sorting) {
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
      results.results = await model.find().sort(sorting).limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}


//App Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
