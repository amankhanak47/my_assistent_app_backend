const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobsSchema = new Schema({
    user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  company: {
    type: String,
  },
  role: {
    type: String,
  },
  ctc: {
    type: String,
  },
  jobid: {
    type: String,
  },
  joblink: {
    type: String,
  },
  applied: {
    type:Boolean
  },
  rejected: {
    type:Boolean
  },
  interview: {
    type:Boolean
  },
  noresponse: {
    type:Boolean
  },
  selected: {
    type:Boolean
  },
  date: {
    type:String
  },
  
});

module.exports = mongoose.model("job", JobsSchema);