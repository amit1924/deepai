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
// import express from 'express';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
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

// // -----------------------------
// // CORS
// // -----------------------------
// const allowedOrigins = [
//   'http://localhost:5173', // local dev
//   'https://deepai-frontend.vercel.app', // production frontend
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed'));
//     }
//   },
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
// app.use('/api/chats', chatRoutes);

// // -----------------------------
// // Start server
// // -----------------------------
// connectDB();
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} in ${ENV.NODE_ENV} mode...`);
// });

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

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
const __dirname = path.resolve();

// -----------------------------
// CORS - More permissive for debugging
// -----------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://deepai-frontend.vercel.app',
        'https://deepai-two.vercel.app',
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked for origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  }),
);

// Handle preflight requests
app.options('*', cors());

// -----------------------------
// Basic route to test if server is working
// -----------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------
// Middleware
// -----------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Bot + Rate limiter (temporarily disable for debugging)
// app.use(botDetector);
// const globalLimiter = new RateLimiter({
//   limit: 2000,
//   windowMs: 15 * 60 * 1000,
// }).getMiddleware();
// app.use(globalLimiter);

// -----------------------------
// API Routes with error handling
// -----------------------------
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/chats', chatRoutes);
  console.log('Routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error);
}

// -----------------------------
// Catch-all for undefined API routes
// -----------------------------
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// -----------------------------
// Error handling middleware
// -----------------------------
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
  });
});

// -----------------------------
// Start server
// -----------------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${ENV.NODE_ENV} mode...`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
