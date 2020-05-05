var express = require("express"),
  bodyParser = require("body-parser"),
  multer = require("multer"),
  mongoose = require("mongoose");

//App Setting
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 5000

const upload = multer({ dest: __dirname + "/uploads/images" });
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
  res.render("/admin/rooms/new");
})

//App Listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
