import passport from "passport";
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import User from "../models/usermodel.js";

const opts = {
    // Tell Passport to extract the JWT from the 'Authorization: Bearer <token>' header
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // verify the incoming JWT using the public key
    secretOrKey: process.env.PUB_KEY
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

export default jwtAuthorisation = passport.authenticate('jwt', { session: false });