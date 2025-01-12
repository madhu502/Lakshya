const router = require("express").Router();
const userController = require("../controllers/userControllers");
const { authGuard, upload } = require("../middleware/authGuard");

// Creating user registration route
router.post("/register", userController.registerUser);

// login routes
router.post("/login", userController.loginUser);

//forgotpassword routes
router.post("/forgot_password", userController.forgotPassword);

router.post("/getToken", userController.getToken);

router.get("/getMe", authGuard, userController.getMe);

router.get("/get_single_user", authGuard, userController.getSingleUser);

router.post("/uploadImage", upload, userController.uploadImage);

router.put("/updateUser/:id", authGuard, userController.updateUserProfile);

// Controller(Export)-> Routes (import)-> use ->(index.js)

//Exporting the routes
module.exports = router;
