const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Support CRM API is running ✅' });
});

// Ticket Routes
const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} 🚀`);
});