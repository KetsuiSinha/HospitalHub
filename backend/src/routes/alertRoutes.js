const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to trigger alert generation
// Protected by authMiddleware to ensure only logged-in users// Generate new alerts (trigger n8n)
router.post('/generate', authMiddleware, alertController.generateAlerts);

// Get all alerts
router.get('/', authMiddleware, alertController.getAlerts);

// Update alert status
router.put('/:id/status', authMiddleware, alertController.updateAlertStatus);

module.exports = router;
