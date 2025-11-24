import mongoose from "mongoose";

const leadSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false, 
        },
        company: { 
            type: String, 
            default: 'N/A' 
        },
        role: { 
            type: String, 
            default: 'N/A' 
        },

        source: {
            type: String, 
            required: true,
        },
        status: {
            type: String,
            enum: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost'],
            default: 'New',
        },
        priority: {
            type: String,
            enum: ['Hot', 'Warm', 'Cold'],
            default: 'Cold',
        },
         communicationLog: [
            {
                type: { type: String }, 
                note: { type: String },
                date: { type: Date, default: Date.now }
            }
        ],
        projectHistory: [
            {
                projectName: { type: String },
                status: { type: String },
                date: { type: String }
            }
        ],
         attachedDocuments: [
            { name: String, link: String }
        ]
    },
    {
        timestamps: true, 
    }
);

export const Lead = mongoose.model('Lead', leadSchema);
