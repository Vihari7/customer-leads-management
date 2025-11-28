import express from "express";
import mongoose from "mongoose";  
import cors from "cors";
import leadsRoute from "./routes/leadsRoute.js"; 
import dotenv from "dotenv";
import cron from "node-cron"; 
import { Lead } from "./models/leadModel.js"; 
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Leads Route Middleware
app.use('/leads', leadsRoute);


app.get('/', (request, response) => {
    console.log(request);
     return response.status(234).send('Welcome to Cuastomer Leads Management System');
});

// --- Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});

// --- AUTOMATED SCHEDULER ---
cron.schedule('0 9 * * *', async () => {
    console.log('--- Running Daily Follow-up Check ---');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
        // Find leads where nextFollowUp is >= Today and < Tomorrow
        const leadsToContact = await Lead.find({
            nextFollowUp: {
                $gte: today,
                $lt: tomorrow
            },
            status: { $ne: 'Lost' } // Don't remind for Lost leads
        });

        if (leadsToContact.length > 0) {
            console.log(`Found ${leadsToContact.length} leads to follow up today:`);
            
            // Prepare email content
             const leadNames = leadsToContact.map(l => l.name).join(', ');

             if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const mailOptions = {
                    from: '"lush-task-system" <system@mycompany.com>',
                    to: 'dviha7@gmail.com', // The admin email
                    subject: ` Action Required: ${leadsToContact.length} Follow-ups Due Today`,
                    text: `Hello,\n\nYou have follow-ups scheduled today for the following leads:\n\n${leadNames}\n\nPlease check the dashboard.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) console.log("Error sending email:", error);
                    else console.log("Notification Email sent: " + info.response);
                });
            } else {
                console.log(` Email config missing. Simulated Email: "Follow up with: ${leadNames}"`);
            }

             //Update Database - Log that a reminder was generated
            leadsToContact.forEach(async (lead) => {
                console.log(`- REMINDER: Follow up with ${lead.name} (${lead.company})`);
                
                // send email notification to the Admin
                // Auto-log that a reminder was triggered
                lead.communicationLog.push({
                    type: 'System',
                    note: 'Daily Reminder: Follow-up due today',
                    date: new Date()
                });
                await lead.save();
            });
        } else {
            console.log('No follow-ups scheduled for today.');
        }
    } catch (error) {
        console.error('Scheduler Error:', error);
    }
});

const PORT = process.env.PORT || 5555;
const mongoDBURL = process.env.MONGO_DB_URL; 

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log('Connected to Database');
        app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
    })
    .catch((error) => {
        console.error(error);
    });