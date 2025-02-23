const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Generate timestamp (YYYYMMDDHHMMSS)
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
};

// Step 1: Get Access Token
const getAccessToken = async () => {
  const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');
  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting token:', error.response?.data || error.message);
    throw error;
  }
};

// Step 2: Trigger STK Push
app.post('/pay', async (req, res) => {
  const { phone, amount } = req.body; // e.g., { "phone": "254712345678", "amount": "50" }
  const timestamp = getTimestamp();
  const password = Buffer.from(`${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`).toString('base64');

  try {
    const token = await getAccessToken();
    const payload = {
      BusinessShortCode: process.env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone, // User’s phone number
      PartyB: process.env.SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: 'https://example.com/callback', // Dummy URL since we’re not using it
      AccountReference: 'RouterPayment',
      TransactionDesc: 'Payment for internet access'
    };

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('STK Push Response:', response.data);
    res.json({ message: 'Payment request sent', data: response.data });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));