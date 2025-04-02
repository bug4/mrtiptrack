import axios from 'axios';

export const sendToTelegram = async (message) => {
  try {
    console.log('Attempting to send to Telegram:', { messageLength: message.length });
    // Use your deployed Render URL instead of localhost
    const response = await axios.post('https://ip-tracker-backend-4d00.onrender.com/api/send-to-telegram', { message });
    console.log('Telegram API response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('Error sending to Telegram:', error.response?.data || error.message);
    return false;
  }
};