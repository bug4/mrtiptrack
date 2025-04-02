const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Log environment variables on startup
console.log('Environment variables loaded:', {
  TELEGRAM_BOT_TOKEN_PREFIX: process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.substring(0, 10) + '...' : 'undefined',
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Proxy route for sending Telegram messages
app.post('/api/send-to-telegram', async (req, res) => {
  try {
    const { message } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    console.log('Request body:', req.body);
    console.log('Credentials available:', {
      botTokenExists: !!botToken,
      chatIdExists: !!chatId, 
      botTokenLength: botToken ? botToken.length : 0,
      chatId: chatId
    });
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    if (!botToken || !chatId) {
      return res.status(400).json({ error: 'Telegram credentials not configured' });
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    console.log('Sending request to Telegram API URL:', url);
    
    // Prepare the payload for Telegram
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    };
    
    console.log('Payload being sent to Telegram:', payload);
    
    const telegramResponse = await axios.post(url, payload);
    console.log('Telegram API response:', telegramResponse.data);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Server error sending to Telegram:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    
    res.status(500).json({ 
      error: 'Failed to send message', 
      details: error.response?.data || error.message 
    });
  }
});

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running correctly' });
});

// Direct test endpoint for Telegram
app.get('/api/test-telegram', async (req, res) => {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      return res.status(400).json({ 
        error: 'Telegram credentials not configured',
        envVars: {
          TELEGRAM_BOT_TOKEN: botToken ? 'Set' : 'Not set',
          TELEGRAM_CHAT_ID: chatId ? 'Set' : 'Not set'
        }
      });
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const testMessage = 'This is a test message from your IP tracker server.';
    
    const telegramResponse = await axios.post(url, {
      chat_id: chatId,
      text: testMessage
    });
    
    res.json({
      success: true,
      telegramResponse: telegramResponse.data
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to send test message to Telegram',
      details: error.response?.data || error.message
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the server by visiting http://localhost:${PORT}/api/test`);
  console.log(`Test Telegram integration by visiting http://localhost:${PORT}/api/test-telegram`);
});