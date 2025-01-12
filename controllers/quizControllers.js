const Quiz = require("../model/quizModel");

const createQuiz = async (req, res) => {
  const { title, description, questions } = req.body;

  try {
    const newQuiz = new Quiz({
      title,
      description,
      questions,
    });

    await newQuiz.save();

    return res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllQuizes = async (req, res) => {
  try {
    const quizes = await Quiz.find({}, "title description");
    return res.status(200).json(quizes);
  } catch (error) {
    console.error("Error fetching quizzes", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getQuizById = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Quiz fetched successfully",
      quiz: quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz by ID", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const submitQuiz = async (req, res) => {
  const { id } = req.params;
  const { selectedAnswers } = req.body;

  try {
    // Fetch the quiz to get correct answers
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Calculate the score based on selected and correct answers
    let score = 0;
    quiz.questions.forEach((question, index) => {
      const correctAnswerIndex = question.options.findIndex(
        (option, optionIndex) => optionIndex === question.correctAnswer
      );

      if (selectedAnswers[index] === correctAnswerIndex) {
        score++;
      }
    });

    // Ensure the score is limited to 100%
    const percentageScore = Math.min(
      (score / quiz.questions.length) * 100,
      100
    );

    res.json({ score: percentageScore });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//Pagination
const getPaginationQuiz = async (req, res) => {
  //page no
  const page = req.query._page || 1;
  const limit = req.query._limit || 7;

  try {
    //find all products, skip, limit
    const quizes = await Quiz.find()
      .skip((page - 1) * limit)
      .limit(limit);

    //if page 6 is requested, result 0
    if (quizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No quiz found",
      });
    }

    //response
    return res.status(201).json({
      success: true,
      message: "quiz Fetched",
      data: quizes,
      count: quizes.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createQuiz,
  getAllQuizes,
  submitQuiz,
  getPaginationQuiz,
  getQuizById,
};
