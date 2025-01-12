const mongoose = require("mongoose");
// model for question in quiz

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
});

//model for quiz 
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [questionSchema],
  },
  { collection: "quizes" }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
