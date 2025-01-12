const mongoose = require("mongoose");

const premiumQuizSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    totalPrice: Number,
    paymentMethod: { type: String, enum: ["khalti"] },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PremiumQuiz", premiumQuizSchema);
