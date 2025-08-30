import { Router } from 'express';
import DoctorAvailability from '../models/DoctorAvailability.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

/**
 * Create or update doctor availability
 */
router.post('/', auth, requireRole('doctor'), async (req, res) => {
    try {
        const { week, closedDates } = req.body;

        const availability = await DoctorAvailability.findOneAndUpdate(
            { doctor: req.user.id },
            { week, closedDates },
            { new: true, upsert: true } // create if not exists
        );

        res.json(availability);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

/**
 * Get logged-in doctor’s availability
 */
router.get('/me', auth, requireRole('doctor'), async (req, res) => {
    const availability = await DoctorAvailability.findOne({ doctor: req.user.id });
    res.json(availability || {});
});

/**
 * Get availability of a specific doctor (for patients to check)
 */
router.get('/:doctorId', auth, requireRole('patient'), async (req, res) => {
    const availability = await DoctorAvailability.findOne({ doctor: req.params.doctorId });
    if (!availability) return res.status(404).json({ message: 'Availability not set' });
    res.json(availability);
});

export default router;
