import axios from 'axios';

// Service to detect IP address using a public API
export const getVisitorIP = async () => {
  try {
    // Using ipify API to get the client's IP address
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return null;
  }
};

// Get additional IP information
export const getIPInfo = async (ip) => {
  try {
    // Using ipapi for additional information
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return null;
  }
};