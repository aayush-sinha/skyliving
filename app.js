var express = require("express"),
  bodyParser = require("body-parser"),
  multer = require("multer"),
  mongoose = require("mongoose");

//App Setting
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const upload = multer({ dest: __dirname + "/uploads/images" });
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/skytest");
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

Room.find({}, function (err, room) {
  if (err) {
    console.log(err);
  } else {
    rooms = room;
  }
});

Room.count({}, function (err, count) {
  if (err) {
    console.log(err);
  } else {
    total = count;
  }
});

//App Routes
app.get("/", function (req, res) {
  res.render("home", { featured: rooms });
});
app.get("/roomlist", function (req, res) {
  res.render("roomlist");
});
app.get("/room", function (req, res) {
  res.render("room");
});

//**************** Admin Routes ********************

//Admin home Route
app.get("/admin", function (req, res) {
  res.render("admin_home", { topbarHeading: "Dashboard", roomCount: total });
});
//Index Rooms
app.get("/admin/rooms", function (req, res) {
  res.render("admin_room_index", { topbarHeading: "Property List", rooms: rooms });
});

// New Route

app.get("/admin/rooms/new", function (req, res) {
  res.render("admin_room_new", { topbarHeading: "Add New Property" });
});

//App Listen
app.listen(3000, function () {
  console.log("Server Started!");
});
