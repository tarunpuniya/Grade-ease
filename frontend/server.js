// server.js (FINAL FIXED VERSION)
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer'); 

// 1. .env file se variables load karein
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// --- Security Checks ---
if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
    process.exit(1);
}
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("WARNING: EMAIL_USER or EMAIL_PASS not set in .env. Student OTP will NOT work.");
}

let db; // Database connection object
const otpStore = {}; // Simple object to store OTPs (in-memory)

// --- Email Transporter Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Utility function to send OTP email
async function sendOtpEmail(toEmail, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'GradeFlow OTP Verification Code',
        html: `<p>Your verification code for GradeFlow is: <strong>${otp}</strong></p>
               <p>This code is valid for 5 minutes. Do not share this code.</p>`
    };
    await transporter.sendMail(mailOptions);
}


// --- Middleware Setup ---
app.use(express.json()); 
app.use(express.static(path.join(__dirname))); 

// --- Database Connection Function (UPDATED) ---
async function connectDB() {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db('gradeflow_db');
        console.log("MongoDB connected successfully.");

        // *** FIX: Mock users ko har baar reset karo taaki EMAIL_USER hamesha database mein ho ***
        const usersCollection = db.collection('users');
        
        // 1. Purane records delete karein
        await usersCollection.deleteMany({});
        
        // 2. Naye mock users ko insert karein (jo ab correct EMAIL_USER use karega)
        await usersCollection.insertMany([
            { email: 'teacher@gradeflow.edu', password: '12345', role: 'teacher' },
            { email: process.env.EMAIL_USER, password: 'spass', role: 'student' } 
        ]);
        
        console.log(`Mock users created/reset successfully in MongoDB. Student email: ${process.env.EMAIL_USER}`);
        // --------------------------------------------------------------------------------------

    } catch (err) {
        console.error("MongoDB connection error:", err);
        console.error("Double-check your MONGO_URI and Atlas Network Access (IP Whitelist).");
        process.exit(1);
    }
}

// ----------------------------------------------------
// --- API Routes (No Logic Change needed here) ---
// ----------------------------------------------------

// 1. POST /api/login: ONLY for Teacher Authentication (Password-based)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!db) return res.status(500).json({ success: false, message: 'Server not ready.' });

    try {
        const user = await db.collection('users').findOne({ email: email, role: 'teacher' });

        if (user && user.password === password) { 
            return res.status(200).json({
                success: true,
                role: user.role,
                redirectUrl: 'teacher_dashboard.html'
            });
        }

        res.status(401).json({ success: false, message: 'Invalid Email or Password (Teacher).' });

    } catch (error) {
        console.error("Teacher Login route error:", error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});


// 2. NEW: POST /api/send-otp: Student Login - Step 1
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;

    // Check if the email exists and is a student
    const user = await db.collection('users').findOne({ email: email, role: 'student' });

    if (!user) {
        // FIX: Ab yeh error nahi aana chahiye kyunki user hamesha insert ho raha hai
        return res.status(404).json({ success: false, message: 'Student account not found in records.' }); 
    }

    // Generate and store OTP (4 digit number)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; 
    
    otpStore[email] = { otp, expiry }; 

    try {
        await sendOtpEmail(email, otp);
        
        console.log(`[OTP Sent] ${otp} to ${email}`);
        return res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP email. Check Nodemailer setup.' });
    }
});


// 3. NEW: POST /api/verify-otp: Student Login - Step 2
app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const storedData = otpStore[email];

    if (!storedData) {
        return res.status(400).json({ success: false, message: 'OTP request not found or expired.' });
    }
    
    if (storedData.expiry < Date.now()) {
        delete otpStore[email];
        return res.status(400).json({ success: false, message: 'OTP expired. Please resend.' });
    }
    
    if (storedData.otp === otp) {
        delete otpStore[email]; 
        
        return res.status(200).json({ success: true, redirectUrl: 'student_dashboard.html' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid OTP. Try again.' });
    }
});


// 4. GET /api/dashboard/:role: Simple Data Fetch (Existing Logic)
app.get('/api/dashboard/:role', async (req, res) => {
    const { role } = req.params;
    
    if (role === 'teacher') {
        // --- NEW REALISTIC MOCK DATA STRUCTURE ---
        const pendingAssignments = [
            { id: 101, student: 'Tarun Singh', assignment: 'DSA Mid-Term Project', submissionTime: '2 hours ago', status: 'Submitted', fileLink: 'dsa_note.pdf' },
            { id: 102, student: 'Amit Kumar', assignment: 'Web Tech Lab 5', submissionTime: '1 day ago', status: 'Submitted', fileLink: 'dsa_notes.pdf' },
            { id: 103, student: 'Priya Sharma', assignment: 'ML Project Draft', submissionTime: 'Not Submitted', status: 'Pending', fileLink: null },
            { id: 104, student: 'Rahul Gupta', assignment: 'DSA Mid-Term Project', submissionTime: '4 hours ago', status: 'Submitted', fileLink: 'dsa_note.pdf' },
        ];
        
        return res.json({ 
            name: 'Ms. Smith', 
            summary: `You have ${pendingAssignments.filter(p => p.status === 'Submitted').length} new submissions to grade.`,
            pendingAssignments: pendingAssignments // <--- NEW: Sending the array
        });
        // ------------------------------------------

    } else if (role === 'student') {
        return res.json({ name: 'Student 101 (Fetched from Backend)', summary: 'Current Grade: A, Last Assignment: 95/100.' });
    }
    res.status(404).json({ message: 'Data not found.' });
});


// --- Server Start ---
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n-----------------------------------------`);
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`🌐 Frontend URL: http://localhost:${PORT}/login.html`);
        console.log(`-----------------------------------------\n`);
    });
});