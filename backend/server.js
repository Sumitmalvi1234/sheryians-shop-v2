const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
// 📝 Step 1: Import the new auth routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');


// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Modern Dynamic CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Local Vite development
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 📝 Step 2: Mount the auth routes to the /api/auth path
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);


// Base Health Check Route
app.get('/', (req, res) => {
  res.send('🚀 V2 E-commerce API is running successfully!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Server running on port ${PORT}`);
});
