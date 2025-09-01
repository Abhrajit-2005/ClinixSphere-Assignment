import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { appointmentCreateSchema } from '../utils/validators.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import { rangesOverlap } from '../utils/overlaps.js';

const router = Router();
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


// Patient books an appointment
router.post('/', auth, requireRole("patient"), async (req, res) => {
    try {
        console.log("DEBUG: Appointment booking attempt by user", req.user.id);

        if (req.user.role !== 'patient')
            return res.status(403).json({ message: 'Only patients can book' });

        const { doctorId, time } = appointmentCreateSchema.parse(req.body);

        const doctorUser = await User.findById(doctorId);
        if (!doctorUser || doctorUser.role !== 'doctor')
            return res.status(404).json({ message: 'Doctor not found' });

        const apptStart = dayjs(time).local();
        if (!apptStart.isValid()) return res.status(400).json({ message: 'Invalid time' });
        const apptEnd = apptStart.add(30, 'minute'); // fixed 30-min slots

        // Check availability
        const dateISO = apptStart.format('YYYY-MM-DD');
        const dayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][apptStart.day()];
        const avail = await DoctorAvailability.findOne({ doctor: doctorId });
        if (!avail) return res.status(400).json({ message: 'Doctor availability not set' });
        if (avail.closedDates?.includes(dateISO))
            return res.status(400).json({ message: 'Doctor unavailable on this date' });

        const slots = avail.week?.[dayKey] || [];
        const withinSlot = slots.some(s => {
            const slotStart = dayjs(`${dateISO} ${s.start}`).local();
            const slotEnd = dayjs(`${dateISO} ${s.end}`).local();
            return apptStart.isSameOrAfter(slotStart) && apptEnd.isSameOrBefore(slotEnd);
        });


        console.log("DEBUG Booking", {
            rawTime: time,
            apptStart: apptStart.format(),
            apptEnd: apptEnd.format(),
            slots: slots.map(s => ({
                start: `${dateISO} ${s.start}`,
                end: `${dateISO} ${s.end}`
            }))
        });


        if (!withinSlot) return res.status(400).json({ message: 'Outside working hours' });

        // Overlaps handling
        const sameDayAppts = await Appointment.find({
            doctor: doctorId,
            time: {
                $gte: apptStart.startOf('day').toDate(),
                $lt: apptStart.endOf('day').toDate()
            }
        });
        const overlaps = sameDayAppts.some(a => {
            const aStart = dayjs(a.time);
            const aEnd = aStart.add(30, 'minute');
            return rangesOverlap(apptStart.toDate(), apptEnd.toDate(), aStart.toDate(), aEnd.toDate());
        });
        if (overlaps) return res.status(409).json({ message: 'Time slot already booked' });

        // Create appointment
        const appt = await Appointment.create({
            patient: req.user.id,
            doctor: doctorId,
            time: apptStart.toDate()
        });

        res.status(201).json(appt);
    } catch (e) {
        res.status(400).json({ message: e.errors?.[0]?.message || e.message });
    }
});

// Doctor: list their appointments
router.get('/mine', auth, requireRole('doctor'), async (req, res) => {
    const appts = await Appointment.find({ doctor: req.user.id })
        .populate('patient', 'name email')
        .sort({ time: 1 });
    res.json(appts);
});

// Patient: list own appointments
router.get('/my-patient', auth, requireRole('patient'), async (req, res) => {
    const appts = await Appointment.find({ patient: req.user.id })
        .populate('doctor', 'name email')
        .sort({ time: 1 });
    res.json(appts);
});

// Doctor updates status (completed/cancelled)
router.patch('/:id/status', auth, requireRole('doctor'), async (req, res) => {
    const { status } = req.body; // 'completed' | 'cancelled'
    if (!['completed', 'cancelled'].includes(status))
        return res.status(400).json({ message: 'Invalid status' });

    const appt = await Appointment.findOne({ _id: req.params.id, doctor: req.user.id });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    appt.status = status;
    await appt.save();
    res.json(appt);
});

export default router;
