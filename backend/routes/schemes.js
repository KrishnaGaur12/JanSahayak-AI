const express = require('express');
const router = express.Router();
const schemes = require('../data/schemes.json');

/**
 * GET /api/schemes
 * Returns all schemes
 */
router.get('/schemes', (req, res) => {
    res.json({ schemes, total: schemes.length });
});

/**
 * GET /api/schemes/:id
 * Returns a single scheme by ID
 */
router.get('/schemes/:id', (req, res) => {
    const scheme = schemes.find(s => s.id === req.params.id);
    if (!scheme) {
        return res.status(404).json({ error: 'Scheme not found' });
    }
    res.json(scheme);
});

module.exports = router;
