import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const testChapaKey = async () => {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  
  console.log("Testing Chapa API Key:", secretKey?.substring(0, 20) + "...");
  
  try {
    // Simple test request to verify key
    const response = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount: '100',
        currency: 'ETB',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        tx_ref: `test-${Date.now()}`,
        callback_url: 'http://localhost:3000/test',
        return_url: 'http://localhost:3000/test'
      },
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("API Key is VALID!");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("API Key is INVALID!");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data?.message);
  }
};

testChapaKey();