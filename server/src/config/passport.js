// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const { email, name, picture } = profile._json;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name, avatarUrl: picture ,

           type: 'employee',    // ✅ Required field
            roles: ['seeker','referrer'],
           currentRole :'seeker',
            isVerified : true,
        provider: 'google'  
    });
  }

  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
