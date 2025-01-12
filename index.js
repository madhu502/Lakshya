const path = require("path");
// importing the pacakages(express)
const express = require("express");

const morgan = require("morgan");
// const mongoose = require("mongoose");

const connectDatabase = require("./database/database");
const dotenv = require("dotenv");

const cors = require("cors");
const acceptFormData = require("express-fileupload");
const { authGuard } = require("./middleware/authGuard");

// Creating an express application
const app = express();

//Configure cors policy
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Express JSON config
app.use(express.json());
app.use(morgan("dev"));

//Config form data
app.use(acceptFormData());

//Make a static public folder
// app.use(express.static("./public"));
app.use(express.static(path.join(__dirname, "./public")));

// Connecting  to Database
connectDatabase();

// dotenv configuration
dotenv.config();

//Defining the port
const PORT = process.env.PORT;

app.get("/lakshya", (req, res) => {
  res.send("Lakshya api is working..");
});

// for khalti api
app.post("/initialize-khalti", async (req, res) => {
  try {
    //try catch for error handling
    const { itemId, totalPrice, website_url } = req.body;
    const itemData = await Item.findOne({
      _id: itemId,
      price: Number(totalPrice),
    });

    if (!itemData) {
      return res.status(400).send({
        success: false,
        message: "item not found",
      });
    }
    // creating a purchase document to store purchase info
    const purchasedItemData = await PurchasedItem.create({
      item: itemId,
      paymentMethod: "khalti",
      totalPrice: totalPrice * 100,
    });

    const paymentInitate = await initializeKhaltiPayment({
      amount: totalPrice * 100, // amount should be in paisa (Rs * 100)
      purchase_order_id: purchasedItemData._id, // purchase_order_id because we need to verify it later
      purchase_order_name: itemData.name,
      return_url: `${process.env.MONGODB}`,
      website_url,
    });

    res.json({
      success: true,
      purchasedItemData,
      payment: paymentInitate,
    });
  } catch (error) {
    console.error("Error in initialize-khalti", error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error,
    });
  }
});

app.get("/create-item", async (req, res) => {
  let itemData = await Item.create({
    name: "Test2",
    price: 1000,
    inStock: true,
    category: "Nice",
  });
  res.json({
    success: true,
    item: itemData,
  });
});

// Configuring Routes of User

app.use("/api/user", require("./routes/userRoutes"));

app.use("/api/quizes", require("./routes/quizRoutes"));

app.use("/api/resource", require("./routes/resourceRoutes"));


// app.use("/api/khalti", require("./routes/khaltiRoutes"));

// http://localhost5000/api/user/create

//Starting the server
app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT} !`);
});

module.exports = app;
