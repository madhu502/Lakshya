const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  stream: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },

  
  image: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const Resource = mongoose.model("resources", resourceSchema);

module.exports = Resource;
