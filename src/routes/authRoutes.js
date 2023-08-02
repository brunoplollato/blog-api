// routes/userRoutes.js
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('../utils/jwt');
const createError = require('http-errors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { registerHandler, loginHandler, logoutHandler, verifyEmail, refreshTokenHandler } = require('../controllers/authController');
const prisma = new PrismaClient();
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../environments');
const hashedPassword = bcrypt.hashSync(Math.random().toString(36).slice(-8), 8)

const router = express.Router();

passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/auth/github/callback`,
      passReqToCallback: true
    },
    async function(accessToken, refreshToken, profile, next) {
      try {
        console.log("🚀 ~ file: authRoutes.js:23 ~ function ~ profile:", profile)
        const oldUser = await prisma.user.findUnique({
          where: { email: 'brunopa@gmail.com' }
        })
        console.log("🚀 ~ file: authRoutes.js:28 ~ function ~ oldUser:", oldUser)

        if (oldUser)
          return oldUser
                  
        const newUser = await prisma.user.create({
          data: {
            name: profile.displayName,
            email: 'email@example.com',
            provider: 'github',
            providerId: profile.id,
            roleName: 'user',
            password: hashedPassword,
          }
        });
        console.log("🚀 ~ file: authRoutes.js:42 ~ function ~ newUser:", newUser)

        if (newUser)
          return newUser
      } catch (error) {
        return createError.InternalServerError(error);
      }
    }
));

passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `https://localhost:3000/auth/google/callback`
    },
    async (issuer, profile, cb) => {
      console.log("🚀 ~ file: authRoutes.js:61 ~ issuer:", issuer)
      try {
        const oldUser = await prisma.user.findUnique({
          where: { email: profile._json.email }
        }).then(async res => {
          const oldUserAccessToken = await jwt.signAccessToken(oldUser)
          return res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
              user: {
                id: oldUser.id,
                email: oldUser.email,
                name: oldUser.name,
              },
              oldUserAccessToken
            }
          });
        })
          

        const newUser = await prisma.user.create({
          data: {
            name: profile.displayName,
            email: profile._json.email,
            provider: 'google',
            providerId: profile.id,
            roleName: 'user',
            password: hashedPassword,
            avatar: profile._json.picture
          }
        });

        const newUserAccessToken = await jwt.signAccessToken(newUser);
        console.log("🚀 ~ file: authRoutes.js:77 ~ newUserAccessToken:", newUserAccessToken)

      } catch (error) {
        return createError.InternalServerError(error);
      }
    }
  ));

// Register
router.post('/register', registerHandler);

// Login
router.post('/login', loginHandler);

// Logout
router.get('/logout', logoutHandler);

// Verify email
router.get('/verify-email', verifyEmail);

// Refresh Token
router.post('/refresh-token', refreshTokenHandler);

// GitHub Login
router.get('/github', passport.authenticate('github', { scope: 'user:email' }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/login', successRedirect: '/github/callback/success' }));
router.get('/github/callback/success');

// Google Login
router.get(
  '/google',
  passport.authenticate('google', { session: false, scope: ['email', 'profile'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login', successRedirect: '/google/callback/success' })
);
router.get('/google/callback/success');


module.exports = router;
