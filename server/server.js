const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Trust proxy (required for Render/Vercel — they run behind a reverse proxy)
app.set('trust proxy', 1);

// Security & Middleware
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',       // local dev
  process.env.CLIENT_URL,        // production Vercel URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again later.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit OTP/auth attempts to 20 per 15 minutes
    message: { message: 'Too many auth/OTP requests, please try again later.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Health Check (for Render monitoring)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured in server/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer().catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  process.exitCode = 1;
});
