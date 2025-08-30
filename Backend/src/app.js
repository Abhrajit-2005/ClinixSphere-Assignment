import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.routes.js';
import apptRoutes from './routes/appointments.routes.js';
import doctorAvailRoutes from './routes/doctorAvailability.routes.js';
import prescriptionRoutes from './routes/prescriptions.routes.js'
import doctorDashboardRoutes from './routes/doctorDashboard.routes.js';
import patientRoutes from './routes/patient.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(helmet());
app.use(morgan(process.env.LOG_FORMAT || 'dev'));


// Test route
app.get('/', (req, res) => {
    res.json({ message: 'ClinixSphere API is running 🚀' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/appointments', apptRoutes);
app.use('/doctor-availability', doctorAvailRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use('/doctor-dashboard', doctorDashboardRoutes);
app.use('/patient', patientRoutes);


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server listening at http://localhost:${PORT}`);
    });
});
