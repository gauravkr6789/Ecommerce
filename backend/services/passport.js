import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/UserSchema.model.js";
import generateToken from "../utils/Token/token.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3500/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({
          $or: [{ email }, { googleId: profile.id }],
        });

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            role: "user",
          });
        }

        const token = generateToken(user);

        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;