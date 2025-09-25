import { rateLimit } from 'express-rate-limit'

// Rate limiting middleware to limit repeated requests to public APIs and/or endpoints such as password reset
// This helps to prevent brute-force attacks and reduce server load
// Here, we limit each IP to 100 requests per 15 minutes window
// Adjust the window and limit as per your requirements
// For more options and configurations, refer to the express-rate-limit documentation: https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Limit requests from a whole /56 subnet on IPv6
})

export default limiter;