import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    companyName: { type: String, default: '' },
    role: { type: String, default: '' },
    jobDescription: { type: String, default: '' },
    resumeInfo: { type: String, default: '' },
    content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
