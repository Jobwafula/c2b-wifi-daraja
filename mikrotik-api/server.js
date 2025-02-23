const express = require('express');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/paymentRoutes');
const swaggerDocs = require('./swagger'); // Import Swagger docs

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', paymentRoutes);

// Serve Swagger documentation
swaggerDocs(app); // Initialize Swagger docs

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});