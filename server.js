// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Grievance');

const grievanceSchema = new mongoose.Schema({
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const Grievance = mongoose.model('Grievance', grievanceSchema);

app.post('/api/grievances', async (req, res) => {
    try {
        const newGrievance = new Grievance({ description: req.body.description });
        await newGrievance.save();

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'superhero-email@gmail.com',
            subject: 'New Grievance Submitted',
            text: `A new grievance has been submitted: ${req.body.description}`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Grievance submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting grievance' });
    }
});

app.get('/api/grievances', async (req, res) => {
    try {
        const grievances = await Grievance.find();
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching grievances' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
