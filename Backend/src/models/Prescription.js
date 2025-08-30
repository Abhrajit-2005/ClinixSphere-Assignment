import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    symptoms: { type: String, required: true },
    diagnosis: { type: String, required: true },

    medicines: [
        {
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true }
        }
    ],

    notes: { type: String },

}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
