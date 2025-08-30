import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        speciality: { type: String, required: true },
        experienceYears: { type: Number, default: 0 },
        bio: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model('Doctor', DoctorSchema);
