import React, { useEffect, useState } from 'react';
import { getVisitorIP, getIPInfo } from './services/ipService';
import { sendToTelegram } from './services/telegramService';
import './App.css';

function App() {
  const [ipSent, setIpSent] = useState(false);

  useEffect(() => {
    // Function to capture and send IP on page load
    const captureAndSendIP = async () => {
      if (ipSent) return; // Prevent multiple sends
      
      try {
        // Get visitor's IP
        const ip = await getVisitorIP();
        if (!ip) return;
        
        // Get additional info about the IP
        const ipInfo = await getIPInfo(ip);
        
        // Format message for Telegram
        // In App.js, simplify the message format
const message = `New visitor with IP: ${ip}`;
        
        // Send to Telegram
        const success = await sendToTelegram(message);
        if (success) {
          setIpSent(true);
          console.log('IP information sent to Telegram');
        }
      } catch (error) {
        console.error('Error in IP capture process:', error);
      }
    };

    captureAndSendIP();
  }, [ipSent]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to our website</h1>
        <p>Thanks for visiting!</p>
      </header>
    </div>
  );
}

export default App;