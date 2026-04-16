import Evaluation from "../model/evaluation.model.js";

export async function getAnalysisHistory(req, res) {
  try {
    const evaluations = await Evaluation.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("repoUrl score status duration createdAt languages");

    res.json({ history: evaluations });
  } catch (error) {
    console.error("[History] Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
