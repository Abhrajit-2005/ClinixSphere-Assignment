import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
    {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        time: { type: Date, required: true },
        status: {
            type: String,
            enum: ['booked', 'completed', 'cancelled'],
            default: 'booked'
        }
    },
    { timestamps: true }
);

export default mongoose.model('Appointment', AppointmentSchema);
