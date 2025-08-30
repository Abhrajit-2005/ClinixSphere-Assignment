import mongoose from 'mongoose';

// Single time slot (e.g. 09:00 - 12:30)
const SlotSchema = new mongoose.Schema(
    {
        start: { type: String, required: true }, // format: "HH:mm"
        end: { type: String, required: true }    // format: "HH:mm"
    },
    { _id: false }
);

const DoctorAvailabilitySchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        week: {
            mon: [SlotSchema],
            tue: [SlotSchema],
            wed: [SlotSchema],
            thu: [SlotSchema],
            fri: [SlotSchema],
            sat: [SlotSchema],
            sun: [SlotSchema]
        },
        closedDates: [
            { type: String } // store as ISO date strings e.g. "2025-08-29"
        ]
    },
    { timestamps: true }
);

export default mongoose.model('DoctorAvailability', DoctorAvailabilitySchema);
