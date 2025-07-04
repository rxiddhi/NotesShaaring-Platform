const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function () {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const state = req.query.state;

          const email = profile.emails[0].value;

          if (state === 'signup') {
            // Signup flow
            let user = await User.findOne({ email });
            if (!user) {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: email,
              });
              user._alreadyExists = false;
            } else {
              user._alreadyExists = true;
            }
            return done(null, user);
          } else {
            // Login flow
            let user = await User.findOne({ email });
            if (!user) {
              return done(null, false, {
                message: 'No account found. Please sign up first.',
              });
            }

            // Link Google if not already linked
            if (!user.googleId) {
              user.googleId = profile.id;
              user.name = user.name || profile.displayName;
              await user.save();
            }

            return done(null, user);
          }
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};
