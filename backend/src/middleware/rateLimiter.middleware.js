// // src/middleware/rateLimiter.middleware.js

// class RateLimiter {
//   constructor(options = {}) {
//     this.limit = options.limit || 100; // Max requests per window
//     this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
//     this.message =
//       options.message || 'Too many requests, please try again later.';
//     this.statusCode = options.statusCode || 429;
//     this.keyGenerator = options.keyGenerator || this.defaultKeyGenerator;
//     this.skipSuccessfulRequests = options.skipSuccessfulRequests || false;
//     this.skip = options.skip || (() => false); // Function to conditionally skip limiting

//     this.store = new Map();

//     // Clean up old entries every minute to prevent memory leaks
//     setInterval(() => this.cleanup(), 60 * 1000).unref();
//   }

//   defaultKeyGenerator(req) {
//     return req.headers['x-api-key'] || (req.user && req.user._id) || req.ip;
//   }

//   cleanup() {
//     const now = Date.now();
//     for (const [key, value] of this.store.entries()) {
//       if (value.every((ts) => now - ts > this.windowMs)) {
//         this.store.delete(key);
//       }
//     }
//   }

//   getMiddleware() {
//     return (req, res, next) => {
//       if (this.skip(req)) return next();

//       const key = this.keyGenerator(req);
//       const now = Date.now();
//       const windowStart = now - this.windowMs;

//       if (!this.store.has(key)) this.store.set(key, []);

//       const timestamps = this.store.get(key);
//       const requestsInWindow = timestamps.filter((ts) => ts > windowStart);

//       if (requestsInWindow.length >= this.limit) {
//         const retryAfter = Math.ceil(
//           (timestamps[0] + this.windowMs - now) / 1000,
//         );
//         res.setHeader('Retry-After', retryAfter);
//         return res.status(this.statusCode).json({
//           error: this.message,
//           retryAfter: `${retryAfter} seconds`,
//         });
//       }

//       timestamps.push(now);
//       timestamps.sort((a, b) => a - b);
//       this.store.set(key, timestamps);

//       res.setHeader('X-RateLimit-Limit', this.limit);
//       res.setHeader(
//         'X-RateLimit-Remaining',
//         Math.max(0, this.limit - requestsInWindow.length - 1),
//       );
//       res.setHeader(
//         'X-RateLimit-Reset',
//         Math.ceil((now + this.windowMs) / 1000),
//       );

//       next();
//     };
//   }
// }

// // --- Bot Detector ---
// const botDetector = (req, res, next) => {
//   const userAgent = req.get('User-Agent') || '';
//   req.isBot =
//     /bot|curl|spider|crawler|google|ping|monitor|check|scan|PostmanRuntime|vscode-restclient/i.test(
//       userAgent,
//     );
//   console.log('User-Agent:', userAgent);
//   console.log('Is Bot:', req.isBot);
//   next();
// };

// export { RateLimiter, botDetector };

class RateLimiter {
  constructor(options = {}) {
    this.limit = options.limit || 100;
    this.windowMs = options.windowMs || 15 * 60 * 1000;
    this.message =
      options.message || 'Too many requests, please try again later.';
    this.statusCode = options.statusCode || 429;
    this.keyGenerator = options.keyGenerator || this.defaultKeyGenerator;
    this.skipSuccessfulRequests = options.skipSuccessfulRequests || false;
    this.skip = options.skip || (() => false);

    this.store = new Map();

    // Cleanup old entries to prevent memory leaks
    setInterval(() => this.cleanup(), 60 * 1000).unref();
  }

  defaultKeyGenerator(req) {
    // Use user ID if authenticated, else IP
    return (req.user && req.user._id) || req.ip;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.store.entries()) {
      const filtered = timestamps.filter((ts) => now - ts <= this.windowMs);
      if (filtered.length === 0) this.store.delete(key);
      else this.store.set(key, filtered);
    }
  }

  getMiddleware() {
    return (req, res, next) => {
      if (this.skip(req)) return next();

      const key = this.keyGenerator(req);
      const now = Date.now();
      const windowStart = now - this.windowMs;

      if (!this.store.has(key)) this.store.set(key, []);

      const timestamps = this.store.get(key);
      const requestsInWindow = timestamps.filter((ts) => ts > windowStart);

      if (requestsInWindow.length >= this.limit) {
        const retryAfter = Math.ceil(
          (timestamps[0] + this.windowMs - now) / 1000,
        );
        res.setHeader('Retry-After', retryAfter);
        return res.status(this.statusCode).json({
          error: this.message,
          retryAfter: `${retryAfter} seconds`,
        });
      }

      timestamps.push(now);
      this.store.set(key, timestamps);

      res.setHeader('X-RateLimit-Limit', this.limit);
      res.setHeader(
        'X-RateLimit-Remaining',
        Math.max(0, this.limit - requestsInWindow.length - 1),
      );
      res.setHeader(
        'X-RateLimit-Reset',
        Math.ceil((now + this.windowMs) / 1000),
      );

      next();
    };
  }
}

// Bot detection middleware
const botDetector = (req, res, next) => {
  const ua = req.get('User-Agent') || '';
  req.isBot =
    /bot|curl|spider|crawler|google|ping|monitor|check|scan|PostManRuntime|vscode-restclient/i.test(
      ua,
    );
  next();
};

export { RateLimiter, botDetector };
