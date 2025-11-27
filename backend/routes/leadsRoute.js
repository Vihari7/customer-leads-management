import express from 'express';
import { Lead } from '../models/leadModel.js';

const router = express.Router();

// Create a new Lead
router.post('/', async (request, response) => {
    try {
        if (!request.body.name || !request.body.email || !request.body.source) {
            return response.status(400).send({
                message: 'Send all required fields: name, email, source',
            });
        }
        const newLead = {
            name: request.body.name,
            email: request.body.email,
            phone: request.body.phone,
            company: request.body.company, 
            source: request.body.source,
            priority: request.body.priority,
            jobTitle: request.body.jobTitle,
            status: request.body.status,
            nextFollowUp: request.body.nextFollowUp,
            notes: request.body.notes,
        };
        const lead = await Lead.create(newLead);
        return response.status(201).send(lead);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get ALL Leads
router.get('/', async (request, response) => {
    try {
        const leads = await Lead.find({});
        return response.status(200).json({
            count: leads.length,
            data: leads
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Get ONE Lead by ID
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const lead = await Lead.findById(id);
        return response.status(200).json(lead);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Update a Lead
router.put('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Lead.findByIdAndUpdate(id, request.body);
        if (!result) {
            return response.status(404).json({ message: 'Lead not found' });
        }
        return response.status(200).send({ message: 'Lead updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Delete a Lead
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Lead.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Lead not found' });
        }
        return response.status(200).send({ message: 'Lead deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Add Communication Log
router.post('/:id/log', async (request, response) => {
    try {
        const { id } = request.params;
        const { type, note } = request.body; 

        const lead = await Lead.findById(id);
        if (!lead) return response.status(404).json({ message: 'Lead not found' });

        // Push new log to the array
        lead.communicationLog.push({ type, note, date: new Date() });
        await lead.save();

        return response.status(200).json(lead);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Add Document Link
router.post('/:id/document', async (request, response) => {
    try {
        const { id } = request.params;
        const { name, link } = request.body;

        const lead = await Lead.findById(id);
        if (!lead) return response.status(404).json({ message: 'Lead not found' });

        // Push new document to the array
        lead.attachedDocuments.push({ name, link });
        await lead.save();

        return response.status(200).json(lead);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
router.post('/webhook/capture', async (request, response) => {
    try {
        const { name, email, source, phone, company, notes } = request.body;

        // Validation for external data
        if (!name || !email) {
            return response.status(400).json({ success: false, message: 'Name and Email are required' });
        }

        // Check if lead already exists to prevent duplicates
        const existingLead = await Lead.findOne({ email: email });
        if (existingLead) {
            // Update existing lead or just return success
            return response.status(200).json({ success: true, message: 'Lead already exists', id: existingLead._id });
        }

        const newLead = {
            name,
            email,
            phone: phone || '',
            company: company || 'External Lead',
            source: source || 'Auto-Capture', 
            status: 'New',                    // Always start as New
            priority: 'Warm',                 
            notes: notes || 'Captured via External Webhook',
            communicationLog: [{
                type: 'System',
                note: 'Lead auto-captured from external integration',
                date: new Date()
            }]
        };

        const lead = await Lead.create(newLead);
        console.log(`[Auto-Capture] New lead created: ${lead.email}`);
        
        return response.status(201).json({ success: true, id: lead._id });

    } catch (error) {
        console.error("Webhook Error:", error.message);
        response.status(500).json({ success: false, message: error.message });
    }
});

export default router;