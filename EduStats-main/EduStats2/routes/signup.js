const User = require("../models/userModel");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
    const { name, email, password } = req.body || {};
    console.log('[signup] payload:', req.body);
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing name, email or password' });
        }
        if (typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // do not set auth cookie here; require explicit login

        // send welcome email (best-effort)
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.CONTACT_EMAIL,
                    pass: process.env.CONTACT_EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: `"EduStats" <${process.env.CONTACT_EMAIL}>`,
                to: email,
                subject: "Welcome to EduStats",
                html: `
                    <h2>Welcome to EduStats, ${name}!</h2>
                    <p>Thanks for signing up. EduStats helps you import student data, generate visualizations, and track progress over time.</p>
                    <p>Quick links:</p>
                    <ul>
                        <li>Upload Excel: Upload class data and auto-generate insights</li>
                        <li>Dashboard: View saved visualizations and metrics</li>
                    </ul>
                    <p>If you have any questions reply to this email.</p>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error("Failed to send welcome email:", mailErr);
        }

        // return created user
        return res.status(201).json({ message: "User created successfully", user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        console.error('[signup] error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;