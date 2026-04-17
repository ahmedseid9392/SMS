// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Chapa Payment Gateway Configuration
const CHAPA_CONFIG = {
  secretKey: process.env.CHAPA_SECRET_KEY || '',
  baseURL: process.env.CHAPA_API_URL || 'https://api.chapa.co/v1',
  currency: 'ETB',
  successUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
  cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
};

// Log status
if (!CHAPA_CONFIG.secretKey) {
  console.warn("⚠️ CHAPA_SECRET_KEY is not set. Chapa payments will be disabled.");
  console.warn("   Add CHAPA_SECRET_KEY to your .env file to enable Chapa payments.");
} else {
  console.log("✅ CHAPA_SECRET_KEY is configured");
}

export default CHAPA_CONFIG;