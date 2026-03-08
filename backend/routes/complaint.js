const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory complaints store (replace with DB in production)
const complaints = new Map();

/**
 * Generate tracking ID in format: JS-YYYYMMDD-XXXXX
 */
function generateTrackingId() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    return `JS-${date}-${random}`;
}

/**
 * POST /api/complaint
 * Submit a civic complaint
 */
router.post('/complaint', (req, res) => {
    try {
        const { description, location, issueType } = req.body;

        if (!description) {
            return res.status(400).json({ error: 'Complaint description is required' });
        }

        const trackingId = generateTrackingId();
        const complaint = {
            trackingId,
            description,
            location: location || 'Not specified',
            issueType: issueType || 'general',
            status: 'submitted',
            reportedAt: new Date().toISOString(),
            statusHistory: [
                {
                    status: 'submitted',
                    timestamp: new Date().toISOString(),
                    notes: 'Complaint registered successfully'
                }
            ]
        };

        complaints.set(trackingId, complaint);

        res.json({
            success: true,
            trackingId,
            message: 'Complaint registered successfully',
            messageHi: 'शिकायत सफलतापूर्वक दर्ज की गई है',
            complaint
        });

    } catch (error) {
        console.error('Complaint error:', error.message);
        res.status(500).json({ error: 'Failed to register complaint', message: error.message });
    }
});

/**
 * GET /api/complaint/:trackingId
 * Get complaint status by tracking ID
 */
router.get('/complaint/:trackingId', (req, res) => {
    const complaint = complaints.get(req.params.trackingId);
    if (!complaint) {
        return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(complaint);
});

module.exports = router;
