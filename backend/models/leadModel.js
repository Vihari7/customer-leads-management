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
    },
    {
        timestamps: true, 
    }
);

export const Lead = mongoose.model('Lead', leadSchema);