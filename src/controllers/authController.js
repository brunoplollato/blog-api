const { PrismaClient } = require('@prisma/client');
const jwt = require('../utils/jwt');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM, FRONTEND_BASE_URL } = require('../environments');

exports.registerHandler = async (req, res, next) => {
  const { email, name, password, confirmPassword, roleName = 'user', provider = 'local' } = req.body
  try {
    const user = await prisma.user.findUnique({ 
      where: { email }
    })
    if (user)
      return res.status(403).json({ status: false, message: 'User already exists' });
      
    if (password !== confirmPassword)
      return res.status(403).json({ status: false, message: 'Password and confirm password should be the same' });
    
    const hashedPassword = bcrypt.hashSync(password)
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        roleName,
        password: hashedPassword,
        provider
      },
    });

    const accessToken = await jwt.signAccessToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleName: newUser.roleName,
      avatar: newUser.avatar,
      emailVerified: newUser.emailVerified
    });

    const refreshToken = await jwt.signRefreshToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleName: newUser.roleName,
      avatar: newUser.avatar,
      emailVerified: newUser.emailVerified
    });

    const emailToken = await jwt.signEmailToken({
      id: newUser.id,
      email: newUser.email,
    });

    const emailBody = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
            }
            h1 {
              color: #007bff;
            }
            p {
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff !important;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <h1>Email Verification</h1>
          <p>Hello ${name},</p>
          <p>Thank you for registering with our platform. Please click the button below to verify your email address:</p>
          <a href="${FRONTEND_BASE_URL}/verify-email/${emailToken}" class="button">Verify Email</a>
          <p>If you did not register for an account, please ignore this email.</p>
          <p>Best regards,</p>
          <p>Your Company Name</p>
        </body>
      </html>
    `;

    // Send verification email to user's email address
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      },
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: newUser.email,
      subject: 'Email Verification',
      html: emailBody
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });

    res.status(200).json({
      status: true,
      message: 'User registered successful',
      data: { accessToken, refreshToken}
    });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}))  
  }
}

exports.loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ 
      where: { email },
    });
    
    if (!user) {
      return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }
    
    const passwordMatch = await bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ status: false, message: 'Invalid email or password' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleName: user.roleName,
      avatar: user.avatar,
      emailVerified: user.emailVerified
    }

    const accessToken = await jwt.signAccessToken(payload);
    const refreshToken = await jwt.signRefreshToken(payload);

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: { accessToken, refreshToken}
    });
  } catch (error) {
    next(createError(error));
  }
};

exports.logoutHandler = async (req, res, next) => {
  try {
    // Clear the JWT token by setting an empty token in the response
    res.cookie('accessToken', '', { httpOnly: true, maxAge: 0 });
    res.status(200).json({ status: true, message: 'Logged out successfully' });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}))  
  }
};

exports.verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  try {
    const decodedToken = await  jwt.verifyEmailToken(token);
    const { email } = decodedToken.payload;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) 
      return res.status(404).json({ status: false, message: 'User not found' });
    

    if (user.emailVerified) {
      return res.status(409).json({
        status: false,
        message: 'Email already verified',
      });
    }

    const newUser = await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleName: newUser.roleName,
      avatar: newUser.avatar,
      emailVerified: newUser.emailVerified
    }

    const accessToken = await jwt.signAccessToken(payload);
    const refreshToken = await jwt.signRefreshToken(payload);

    res.status(200).json({
      status: true,
      message: 'Email verificated successful, you are logged in',
      data: { accessToken, refreshToken}
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(res.status(401).json({status: false, message: error.message}))  
    } else {
      return next(res.status(500).json({status: false, message: error.message}))  
    }
  }
};

exports.refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body.data;
    
    const refreshTokenVerify = await jwt.verifyRefreshToken(refreshToken);
    
    const accessToken = await jwt.signAccessToken(refreshTokenVerify.payload);

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: { accessToken, refreshToken}
    });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}))
  }
};