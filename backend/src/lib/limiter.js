// import {
//   RateLimiter,
//   botDetector,
// } from '../middleware/rateLimiter.middleware.js';

// export const createRateLimiter = (router, limiterOptions = {}) => {
//   // Create a rate limiter middleware for this router
//   const limiter = new RateLimiter(limiterOptions).getMiddleware();

//   // Apply bot detection
//   router.use(botDetector);

//   // Apply rate limiter
//   router.use(limiter);

//   // Block bots immediately
//   //   router.use((req, res, next) => {
//   //     if (req.isBot) {
//   //       return res.status(403).json({ error: 'Bots are not allowed' });
//   //     }
//   //     next();
//   //   });

//   return router;
// };

import {
  RateLimiter,
  botDetector,
} from '../middleware/rateLimiter.middleware.js';

export const createRateLimiter = (router, options = {}) => {
  const limiter = new RateLimiter(options).getMiddleware();

  router.use(botDetector); // detect bots
  router.use(limiter); // apply rate limiting

  return router;
};
