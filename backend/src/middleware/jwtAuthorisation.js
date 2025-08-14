import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from "../models/usermodel.js";

const opts = {
    // Tell Passport to extract the JWT from the 'Authorization: Bearer <token>' header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // verify the incoming JWT using the public key
    secretOrKey: process.env.SECRET_KEY
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // jwt_payload is the decoded token (e.g., { sub: 'user_id', email: '...' })
        // 'sub' is the standard claim for subject (user ID)
        const user = await User.findOne({email: jwt_payload.id});

        if (user) {
            // If user is found, call done with the user object
            // This will attach the user to req.user
            return done(null, user);
        } else {
            // If user is not found
            return done(null, false);
        }
    } catch (err) {
        return done(err);
    }
}));

const jwtAuthorisation = (req, res, next) => {
  // Use a custom callback to gain full control over the response
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // 1. Handle any system-level errors
    if (err) {
      return next(err);
    }

    // 2. Handle authentication failure (no user found)
    // This block runs if the token is missing, invalid, or expired.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'invalid/expoired token',
      });
    }

    // 3. Handle success
    // If authentication is successful, attach the user to the request object
    // and proceed to the next middleware or route handler.
    req.user = user;
    next();
    
  })(req, res, next);
};

export default jwtAuthorisation;