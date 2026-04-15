// Chapa Payment Gateway Configuration
const CHAPA_CONFIG = {
  // Test mode keys (use your actual test keys from Chapa dashboard)
  secretKey: process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-xxxxxxxxxxxxx',
  baseURL: 'https://api.chapa.co/v1',
  webhookSecret: process.env.CHAPA_WEBHOOK_SECRET || 'webhook_secret_key',
  
  // Payment settings
  currency: 'ETB',
  timeout: 30, // seconds
  retryCount: 3,
  
  // Return URLs
  successUrl: `${process.env.FRONTEND_URL}/payment/success`,
  cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel`,
  webhookUrl: `${process.env.BACKEND_URL}/api/payments/chapa-webhook`,
};

export default CHAPA_CONFIG;