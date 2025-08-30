import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

const router = Router();

/**
 * Patient profile
 */
router.get("/profile", auth, requireRole("patient"), async (req, res) => {
    try {
        // Extract user id from token (auth middleware already set req.user.id)
        const userId = req.user.id;

        // Fetch user from DB
        const patient = await User.findById(userId).select("name email role");

        if (!patient) {
            return res.status(404).json({ message: "Patient profile not found" });
        }

        res.json(patient);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/profile", auth, requireRole("patient"), async (req, res) => {
    try {
        const userId = req.user.id;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update fields
        const { name, email } = req.body;
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});


/**
 * Book appointment with a doctor
 */
router.post("/appointments", auth, requireRole("patient"), async (req, res) => {
    const { doctorId, time } = req.body;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const patient = await User.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    const appointment = new Appointment({ doctor, patient, time });
    await appointment.save();
    res.json({ message: "Appointment booked successfully" });
});
/** Get patient's appointments
 */

/** Get all doctors */
router.get("/doctors", auth, requireRole("patient"), async (req, res) => {
    const doctors = await Doctor.find().populate("user", "name email");
    res.json(doctors);
});

export default router;