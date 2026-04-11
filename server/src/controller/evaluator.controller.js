import { cloneRepo } from '../service/cloneRepo.service.js';
import { evaluateProject } from '../service/evaluator.service.js';
import { deleteFolder } from '../utility/deleteFolder.utils.js';

const Evaluation = async (req,res)=>{
try {
    const githubURL = req.body?.githubURL;
    if(!githubURL) return res.status(400).json({'message':'Github Url is required'})

    console.log(`[Evaluation] Started for: ${githubURL}`);

    console.log(`[Clone] Cloning repository...`);
    let repoPath = await cloneRepo(githubURL);
    console.log(`[Clone] Repository cloned to: ${repoPath}`);

    console.log(`[Evaluate] Running evaluation...`);
    const result = await evaluateProject(repoPath);
    console.log(`[Evaluate] Score: ${result.score} | Status: ${result.status}`);

    console.log(`[Cleanup] Deleting cloned repo...`);
    await deleteFolder(repoPath)
    console.log(`[Cleanup] Done`);

    console.log(`[Evaluation] Completed for: ${githubURL}`);
    res.status(200).json({result})
} catch (error) {
    console.error(`[Evaluation] Error: ${error.message || error}`);
    res.status(500).json(error);

}
}

export default Evaluation;