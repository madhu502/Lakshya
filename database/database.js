const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect("mongodb://localhost:27017/lakshya").then(() => {
    console.log("Database connected!");
  });
};

//Exporting the function

module.exports = connectDatabase;
