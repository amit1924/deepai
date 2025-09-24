// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import cors from 'cors';

// import authRoutes from './routes/auth.route.js';
// import messageRoutes from './routes/message.route.js';

// import { connectDB } from './lib/db.js';
// import { ENV } from './lib/env.js';
// import {
//   RateLimiter,
//   botDetector,
// } from './middleware/rateLimiter.middleware.js';

// dotenv.config();

// const app = express();

// const PORT = ENV.PORT || 3000;
// const __dirname = path.resolve();

// // -----------------------------
// // CORS Configuration
// // -----------------------------
// const corsOptions = {
//   origin: ENV.CLIENT_URL || 'http://localhost:5173',
//   credentials: true, // Allow cookies to be sent
// };
// app.use(cors(corsOptions));

// // -----------------------------
// // Middleware
// // -----------------------------
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));
// app.use(cookieParser());

// // Bot detector
// app.use(botDetector);

// // Global rate limiter
// const globalLimiter = new RateLimiter({
//   limit: 2000,
//   windowMs: 15 * 60 * 1000, // 15 minutes
// }).getMiddleware();
// app.use(globalLimiter);

// // -----------------------------
// // API Routes
// // -----------------------------
// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);

// // -----------------------------
// // Test route for bot detection
// // -----------------------------
// app.get('/test-bot', botDetector, (req, res) => {
//   if (!req.isBot) {
//     return res
//       .status(200)
//       .json({ message: 'This is the test route for humans' });
//   } else {
//     return res.status(403).json({ error: 'Bots are not allowed' });
//   }
// });

// // -----------------------------
// // Serve frontend in production
// // -----------------------------
// if (ENV.NODE_ENV === 'production') {
//   const frontendPath = path.join(__dirname, '../frontend/dist');
//   app.use(express.static(frontendPath));

//   // Catch-all route for SPA
//   app.get('*', (_, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
//   });
// }

// // -----------------------------
// // Start server & connect to DB
// // -----------------------------
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}...`);
//   connectDB();
// });

// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import cors from 'cors';

// import authRoutes from './routes/auth.route.js';
// import messageRoutes from './routes/message.route.js';
// import chatRoutes from './routes/chat.route.js';

// import { connectDB } from './lib/db.js';
// import { ENV } from './lib/env.js';
// import {
//   RateLimiter,
//   botDetector,
// } from './middleware/rateLimiter.middleware.js';

// dotenv.config();

// const app = express();
// const PORT = ENV.PORT || 3000;
// const __dirname = path.resolve();

// // -----------------------------
// // CORS
// // -----------------------------
// const corsOptions = {
//   origin: ENV.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// };
// app.use(cors(corsOptions));

// // -----------------------------
// // Middleware
// // -----------------------------
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb', extended: true }));
// app.use(cookieParser());

// // Bot + Rate limiter
// app.use(botDetector);
// const globalLimiter = new RateLimiter({
//   limit: 2000,
//   windowMs: 15 * 60 * 1000,
// }).getMiddleware();
// app.use(globalLimiter);

// // -----------------------------
// // API Routes
// // -----------------------------
// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/chats', chatRoutes); // ✅ now frontend can call /api/chats/*

// // -----------------------------
// // Serve frontend in production
// // -----------------------------
// if (ENV.NODE_ENV === 'production') {
//   const frontendPath = path.join(__dirname, '../frontend/dist');
//   app.use(express.static(frontendPath));

//   app.get('*', (_, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
//   });
// }

// // -----------------------------
// // Start server
// // -----------------------------
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}...`);
//   connectDB();
// });
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import chatRoutes from './routes/chat.route.js';

import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import {
  RateLimiter,
  botDetector,
} from './middleware/rateLimiter.middleware.js';

dotenv.config();

const app = express();
const PORT = ENV.PORT || 3000;

// -----------------------------
// CORS
// -----------------------------
const allowedOrigins = [
  'http://localhost:5173', // local dev
  'https://deepai-frontend.vercel.app', // production frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// -----------------------------
// Middleware
// -----------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Bot + Rate limiter
app.use(botDetector);
const globalLimiter = new RateLimiter({
  limit: 2000,
  windowMs: 15 * 60 * 1000,
}).getMiddleware();
app.use(globalLimiter);

// -----------------------------
// API Routes
// -----------------------------
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chats', chatRoutes);

// -----------------------------
// Start server
// -----------------------------
connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${ENV.NODE_ENV} mode...`);
});
