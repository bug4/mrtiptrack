const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Updated CORS configuration
app.use(cors({
  origin: '*', // In production, you might want to restrict this to your Netlify domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Telegram route
app.post('/api/send-to-telegram', async (req, res) => {
  try {
    const { message } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    console.log('Sending to Telegram:', { messageLength: message?.length });
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API working' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});