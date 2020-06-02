var mongoose = require("mongoose");

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


module.exports = mongoose.model("Query", querySchema);