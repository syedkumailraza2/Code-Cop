import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema({
    repoUrl: { type: String, required: true },
    languages: { type: [String], required: true },
    score: { type: Number, required: true },
    repoSize: { type: Number, required: true },
    fileCount: { type: Number, required: true },
    duration: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;

