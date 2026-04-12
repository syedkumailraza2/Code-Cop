import FeedbackModel from "../model/feedback.model.js";

const submitFeedback = async (req, res) => {
  try {
    const { rating, message, repoUrl } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating (1-5) is required" });
    }

    await FeedbackModel.create({
      rating,
      message: message || "",
      repoUrl: repoUrl || "",
    });

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error(`[Feedback] Error: ${error.message || error}`);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

export default submitFeedback;
