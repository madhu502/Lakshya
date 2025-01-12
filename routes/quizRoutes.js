const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizControllers");
const { authGuard, adminGuard } = require("../middleware/authGuard");

router.post("/createQuiz", quizController.createQuiz); //route for quiz creation
router.get("/get_all_quizes", quizController.getAllQuizes); //route to get all quizzes
router.get("/quizbyid/:id", quizController.getQuizById);
router.post("/:id/submit", quizController.submitQuiz); //route to submit  quizzes

//pagination quer params ?page=1
router.get("/pagination", quizController.getPaginationQuiz);

module.exports = router;
