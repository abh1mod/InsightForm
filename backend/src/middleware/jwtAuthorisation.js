import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from "../models/user.model.js";

const opts = {
    // Tell Passport to extract the JWT from the 'Authorization: Bearer <token>' header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // verify the incoming JWT using the public key
    secretOrKey: process.env.SECRET_KEY
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // jwt_payload is the decoded token (e.g., { sub: 'user_id', email: '...' })
        const user = await User.findOne({_id: jwt_payload.id});

        if (user) {
            // If user is found, call done with the user object
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
        message: 'invalid/expired token',
      });
    }

    // 3. Handle success
    // If authentication is successful, attach the user to the request object
    // and proceed to the next middleware or route handler.
    req.user = user;
    next();
    
  })(req, res, next);
};

const blockIfLoggedIn = (req, res, next) => {
  // Use a custom callback to gain full control over the response
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    // 1. Handle any system-level errors
    if (err) {
      return next(err);
    }

    // if user is found, it means the user is already logged in
    // and we should block access to this route
    if (user) {
      return res.status(401).json({
        success: false,
        message: 'User already logged in',
      });
    }

    next();
    
  })(req, res, next);
};

export default jwtAuthorisation;
export {blockIfLoggedIn};