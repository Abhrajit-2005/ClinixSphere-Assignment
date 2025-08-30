import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';

const router = Router();

/**
 * Doctor profile
 */
router.get('/profile', auth, requireRole('doctor'), async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json(doctor);
});

router.put('/profile', auth, requireRole('doctor'), async (req, res) => {
    const { speciality, experienceYears, bio } = req.body;
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    doctor.speciality = speciality || doctor.speciality;
    doctor.experienceYears = experienceYears !== undefined ? experienceYears : doctor.experienceYears;
    doctor.bio = bio || doctor.bio;
    await doctor.save();
    res.json(doctor);
});

/**
 * Dashboard overview
 */
router.get('/overview', auth, requireRole('doctor'), async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));
        const todayEnd = new Date(now.setHours(23, 59, 59, 999));

        const nextWeek = new Date();
        nextWeek.setDate(todayStart.getDate() + 7);

        // Fetch all appointments for analysis
        const appointments = await Appointment.find({ doctor: req.user.id });

        const totalAppointments = appointments.length;

        const statusCounts = appointments.reduce((acc, appt) => {
            acc[appt.status] = (acc[appt.status] || 0) + 1;
            return acc;
        }, {});

        const upcoming = appointments.filter(
            appt => appt.status === 'booked' && appt.time >= new Date()
        ).length;

        const todayAppointments = appointments.filter(
            appt => appt.time >= todayStart && appt.time <= todayEnd
        );

        const uniquePatients = [...new Set(
            appointments.filter(appt => appt.status === 'completed').map(appt => appt.patient.toString())
        )].length;

        // Group appointments per day for next 7 days
        const next7Days = {};
        for (let i = 0; i <= 7; i++) {
            const day = new Date();
            day.setDate(todayStart.getDate() + i);
            const dateKey = day.toISOString().split('T')[0];
            next7Days[dateKey] = appointments.filter(
                appt => appt.time >= new Date(`${dateKey}T00:00:00.000Z`) &&
                    appt.time <= new Date(`${dateKey}T23:59:59.999Z`)
            ).length;
        }

        res.json({
            totalAppointments,
            statusCounts,
            upcoming,
            todayAppointmentsCount: todayAppointments.length,
            uniquePatients,
            appointmentsNext7Days: next7Days
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/patients', auth, requireRole('doctor'), async (req, res) => {
    try {
        // Get unique patient IDs
        const patientIds = await Appointment.distinct("patient", {
            doctor: req.user.id,
            status: "completed"
        });

        // Fetch full patient details
        const patients = await User.find({ _id: { $in: patientIds } }, "name email");

        res.json(patients);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch patients" });
    }
});


/**
 * Prescriptions issued by doctor
 */
router.get('/prescriptions', auth, requireRole('doctor'), async (req, res) => {
    const prescriptions = await Prescription.find({ doctor: req.user.id })
        .populate('patient', 'name email')
        .populate('appointment', 'time status')
        .sort({ createdAt: -1 });

    res.json(prescriptions);
});

/**
 * Doctor's daily schedule (appointments by date)
 */
router.get('/schedule/:date', auth, requireRole('doctor'), async (req, res) => {
    try {
        const { date } = req.params; // format: YYYY-MM-DD
        if (!date) return res.status(400).json({ message: 'Date is required (YYYY-MM-DD)' });

        // Start & end of the given date
        const start = new Date(`${date}T00:00:00.000Z`);
        const end = new Date(`${date}T23:59:59.999Z`);

        const appointments = await Appointment.find({
            doctor: req.user.id,
            time: { $gte: start, $lte: end }
        })
            .populate('patient', 'name email')
            .sort({ time: 1 });

        res.json(appointments);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

router.get('/schedule', auth, requireRole('doctor'), async (req, res) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    res.redirect(`/doctor-dashboard/schedule/${today}`);
});

/**
 * Patient history with this doctor (appointments + prescriptions)
 */
router.get('/patient-history/:patientId', auth, requireRole('doctor'), async (req, res) => {
    try {
        const { patientId } = req.params;

        // Get all appointments between doctor and this patient
        const appointments = await Appointment.find({
            doctor: req.user.id,
            patient: patientId
        }).sort({ time: -1 });

        // Get all prescriptions issued by this doctor for this patient
        const prescriptions = await Prescription.find({
            doctor: req.user.id,
            patient: patientId
        })
            .populate('appointment', 'time status')
            .sort({ createdAt: -1 });

        res.json({ appointments, prescriptions });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});



export default router;
