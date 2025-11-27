const axios = require('axios');
const Alert = require('../models/alert');

const generateAlerts = async (req, res) => {
  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const webhookToken = process.env.N8N_WEBHOOK_TOKEN;

    if (!webhookUrl) {
      return res.status(500).json({ message: 'N8N_WEBHOOK_URL not configured' });
    }

    console.log('Triggering n8n webhook:', webhookUrl);
    const response = await axios.post(webhookUrl, {
      token: webhookToken,
      trigger: 'manual_admin_action',
      timestamp: new Date().toISOString()
    });
    console.log('n8n response status:', response.status);
    console.log('n8n response data:', response.data);

    // Map n8n response to Alert model structure
    const n8nData = response.data;
    // Handle both array and single object responses
    const alertsData = Array.isArray(n8nData) ? n8nData : [n8nData];

    const savedAlerts = [];

    for (const data of alertsData) {
      const newAlert = new Alert({
        message: data.alert || data.message || 'New Alert',
        priority: data.priority || 'medium',
        timestamp: data.timestamp || 'Just now',
        location: data.location || 'General',
        status: 'active',
        dateTime: new Date().toLocaleString(),
        predictions: data.predictions || 'See description for details.',
        affectedPatients: data.affectedPatients || 0,
        recommendedAction: data.recommendedAction || 'Monitor situation',
        description: data.description || data.alert || 'No additional details provided.',
        hospital: req.user.hospital
      });

      const savedAlert = await newAlert.save();
      savedAlerts.push(savedAlert);
    }

    // Return the saved alerts
    res.status(200).json(savedAlerts);
  } catch (error) {
    console.error('Error triggering n8n workflow:', error.message);
    if (error.response) {
      console.error('n8n error response:', error.response.status, error.response.data);
    }
    res.status(500).json({ message: 'Failed to generate alerts', error: error.message, details: error.response?.data });
  }
};

const getAlerts = async (req, res) => {
  try {
    const { hospital } = req.user;
    const alerts = await Alert.find({ hospital }).sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error.message);
    res.status(500).json({ message: 'Failed to fetch alerts', error: error.message });
  }
};

const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const alert = await Alert.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json(alert);
  } catch (error) {
    console.error('Error updating alert status:', error.message);
    res.status(500).json({ message: 'Failed to update alert status', error: error.message });
  }
};

module.exports = {
  generateAlerts,
  getAlerts,
  updateAlertStatus
};
