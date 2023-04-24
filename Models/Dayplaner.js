const mongoose = require("mongoose");
const { Schema } = mongoose;

const DayPlaner = new Schema({
      user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  a56: {
    type: String,
  },
 a67: {
    type: String,
  },
 a78: {
    type: String,
  },
 a89: {
    type: String,
  },
 a910: {
    type: String,
  },
 a1011: {
    type: String,
  },
 a1112: {
    type: String,
  },
 p121: {
    type: String,
  },
 p12: {
    type: String,
  },
 p23: {
    type: String,
  },
 p34: {
    type: String,
  },
 p45: {
    type: String,
  },
 p56: {
    type: String,
  },
 p67: {
    type: String,
  },
 p78: {
    type: String,
  },
 p89: {
    type: String,
  },
 p910: {
    type: String,
  },
 p1011: {
    type: String,
  },
 p115: {
    type: String,
  },
 
  
});

module.exports = mongoose.model("dayplaner", DayPlaner);