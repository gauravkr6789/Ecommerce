import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/UserSchema.model.js";
import generateToken from "../utils/Token/token.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
      //callbackURL:'http://localhost:3500/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GOOGLE PROFILE FULL =>", profile);

        const email = profile.emails[0].value;
        const avatar = profile.photos?.[0]?.value || "";

        console.log("EMAIL =>", email);
        console.log("PHOTO =>", avatar);

        let user = await User.findOne({
          $or: [
            { email },
            { googleId: profile.id }
          ],
        });

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email,
            googleId: profile.id,
            avatar,
            role: "user",
          });

        } else {
          // update existing user
          user.googleId = profile.id;
          user.avatar = avatar;
          user.username = profile.displayName;

          await user.save();
        }

        console.log("FINAL USER AVATAR =>", user.avatar);

        const token = generateToken(user);

        done(null, {
          user,
          token,
        });

      } catch (err) {
        console.log("GOOGLE AUTH ERROR =>", err);
        done(err, null);
      }
    }
  )
);

export default passport;