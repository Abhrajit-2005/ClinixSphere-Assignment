import { Router } from 'express';
import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import { auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import PDFDocument from "pdfkit";


const router = Router();

/**
 * Doctor creates a prescription for a completed appointment
 */
router.post('/', auth, requireRole('doctor'), async (req, res) => {
    try {
        const { appointmentId, symptoms, diagnosis, medicines, notes } = req.body;

        // Find appointment & check ownership
        const appt = await Appointment.findOne({ _id: appointmentId, doctor: req.user.id });
        if (!appt) return res.status(404).json({ message: 'Appointment not found' });
        if (appt.status !== 'completed')
            return res.status(400).json({ message: 'Can only prescribe for completed appointments' });

        const prescription = await Prescription.create({
            appointment: appointmentId,
            patient: appt.patient,
            doctor: appt.doctor,
            symptoms,
            diagnosis,
            medicines,
            notes,
        });

        res.status(201).json(prescription);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});


/**
 * Patient views their prescriptions
 */
router.get('/my', auth, requireRole('patient'), async (req, res) => {
    const prescriptions = await Prescription.find({ patient: req.user.id })
        .populate('doctor', 'name email')
        .populate('appointment', 'time status');

    res.json(prescriptions);
});

/**
 * Doctor views prescriptions they issued
 */
router.get('/mine', auth, requireRole('doctor'), async (req, res) => {
    const prescriptions = await Prescription.find({ doctor: req.user.id })
        .populate('patient', 'name email')
        .populate('appointment', 'time status');

    res.json(prescriptions);
});

router.get("/:id/pdf", auth, requireRole("doctor"), async (req, res) => {
    const presc = await Prescription.findOne({
        _id: req.params.id,
        doctor: req.user.id
    })
        .populate("patient", "name email")
        .populate("doctor", "name email")
        .populate("appointment", "time");

    if (!presc) return res.status(404).json({ message: "Prescription not found" });

    // Force download with attachment
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="prescription-${presc._id}.pdf"`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("Digital Prescription", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Doctor: ${presc.doctor.name} (${presc.doctor.email})`);
    doc.text(`Patient: ${presc.patient.name} (${presc.patient.email})`);
    doc.text(`Appointment: ${new Date(presc.appointment.time).toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(12).text("Symptoms:", { underline: true });
    doc.text(presc.symptoms || "-");
    doc.moveDown();

    doc.text("Diagnosis:", { underline: true });
    doc.text(presc.diagnosis || "-");
    doc.moveDown();

    doc.text("Medicines:", { underline: true });
    presc.medicines.forEach((m, i) => {
        doc.text(`${i + 1}. ${m.name} — ${m.dosage} (${m.frequency})`);
    });

    doc.end();
});


export default router;
