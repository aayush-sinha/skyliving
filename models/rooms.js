var mongoose = require("mongoose");

var roomSchema = new mongoose.Schema({
    propName: String,
    propLocation: String,
    propAddress: String,
    propSize: Number,
    propLat: Number,
    propLong: Number,
    propRooms: Number,
    // propOccupancy: Array,
    // propCooling: Array,
    propPriceA1: Number,
    propPriceA2: Number,
    propPriceA3: Number,
    propPriceNA1: Number,
    propPriceNA2: Number,
    propPriceNA3: Number,
    propPriceDisplay: Number,
    propImgExt: String,
    propImg1: String,
    propImag2: String,
    propImg3: String,
    propFeatures: Array,
    propDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);