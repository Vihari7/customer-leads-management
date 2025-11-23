import express from 'express';
import { Lead } from '../models/leadModel.js';

const router = express.Router();

// Route to Save a new Lead
router.post('/', async (request, response) => {
    try {
        // Validation: Check if required fields are there
        if (!request.body.name || !request.body.email || !request.body.source) {
            return response.status(400).send({
                message: 'Send all required fields: name, email, source',
            });
        }

        // Create new lead object
        const newLead = {
            name: request.body.name,
            email: request.body.email,
            phone: request.body.phone,
            source: request.body.source,
            priority: request.body.priority,
        };

        const lead = await Lead.create(newLead);
        return response.status(201).send(lead);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to Get ALL Leads
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

// Route to Get One Lead by ID
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

// Route to Update a Lead
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

// Route to Delete a Lead
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

export default router;