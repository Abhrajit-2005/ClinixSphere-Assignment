import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

// Input validation schemas
import { loginSchema, registerSchema } from '../utils/validators.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const data = registerSchema.parse(req.body);

        // check if email already used
        const exists = await User.findOne({ email: data.email });
        if (exists) return res.status(409).json({ message: 'Email already in use' });

        // hash password
        const hash = await bcrypt.hash(data.password, 10);

        // create user
        const user = await User.create({
            name: data.name,
            email: data.email,
            passwordHash: hash,
            role: data.role
        });

        // if doctor, also create doctor profile
        if (data.role === 'doctor') {
            await Doctor.create({ user: user._id, speciality: 'General', experienceYears: 0 });
        }

        // generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (e) {
        res.status(400).json({ message: e.errors?.[0]?.message || e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (e) {
        res.status(400).json({ message: e.errors?.[0]?.message || e.message });
    }
});

export default router;
