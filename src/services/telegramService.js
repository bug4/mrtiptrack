import axios from 'axios';

// Service to send messages to Telegram
export const sendToTelegram = async (message) => {
  try {
    console.log('Attempting to send to Telegram:', { messageLength: message.length });
    // Use the full URL with port 3001
    const response = await axios.post('http://localhost:3001/api/send-to-telegram', { message });
    console.log('Telegram API response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Error sending to Telegram:', error.response?.data || error.message);
    return false;
  }
};