import { cloneRepo } from '../service/cloneRepo.service.js';
import { evaluateProject } from '../service/evaluator.service.js';
import { deleteFolder } from '../utility/deleteFolder.utils.js';
import EvaluationModel from '../model/evaluation.model.js';
import User from '../model/user.model.js';
import { decryptToken } from '../utility/crypto.utils.js';

const Evaluation = async (req,res)=>{
try {
    const githubURL = req.body?.githubURL;
    if(!githubURL) return res.status(400).json({'message':'Github Url is required'})

    const startTime = Date.now();

    console.log(`[Evaluation] Started for: ${githubURL}`);

    // If authenticated, decrypt their GitHub token for private repo access
    let accessToken = null;
    if (req.user) {
      try {
        const user = await User.findById(req.user.userId);
        if (user && user.accessToken) {
          accessToken = decryptToken(user.accessToken, user.accessTokenIv, user.accessTokenTag);
        }
      } catch (err) {
        console.warn(`[Evaluation] Could not decrypt token: ${err.message}`);
      }
    }

    console.log(`[Clone] Cloning repository...`);
    let repoPath = await cloneRepo(githubURL, accessToken);
    console.log(`[Clone] Repository cloned to: ${repoPath}`);

    console.log(`[Evaluate] Running evaluation...`);
    const result = await evaluateProject(repoPath);
    console.log(`[Evaluate] Score: ${result.score} | Status: ${result.status}`);

    console.log(`[Cleanup] Deleting cloned repo...`);
    await deleteFolder(repoPath)
    console.log(`[Cleanup] Done`);

    const duration = Date.now() - startTime;

    // Save to MongoDB (fire-and-forget — don't block the response)
    EvaluationModel.create({
      repoUrl: githubURL,
      languages: result.techStack?.languages || [],
      score: result.score,
      repoSize: result.repoStats?.totalSize || 0,
      fileCount: result.repoStats?.totalFiles || 0,
      duration,
      status: result.status,
      userId: req.user?.userId || null,
    }).then(() => {
      console.log(`[DB] Evaluation saved for: ${githubURL}`);
    }).catch((err) => {
      console.error(`[DB] Failed to save evaluation: ${err.message}`);
    });

    console.log(`[Evaluation] Completed for: ${githubURL} (${duration}ms)`);
    res.status(200).json({result})
} catch (error) {
    console.error(`[Evaluation] Error: ${error.message || error}`);
    res.status(500).json({ message: error.message || "Internal server error" });

}
}

export default Evaluation;