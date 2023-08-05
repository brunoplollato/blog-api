const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from '../utils/jwt';
import createError from 'http-errors';
import {
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  FRONTEND_BASE_URL,
} from '../environments';

const prisma = new PrismaClient();

export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    email,
    name,
    password,
    confirmPassword,
    roleName = 'user',
    provider = 'local',
  } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user)
      return res
        .status(403)
        .json({ status: false, message: 'User already exists' });

    if (password !== confirmPassword)
      return res.status(403).json({
        status: false,
        message: 'Password and confirm password should be the same',
      });

    const hashedPassword = bcrypt.hashSync(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        roleName,
        password: hashedPassword,
        provider,
      },
    });

    const accessToken = await jwt.signAccessToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleName: newUser.roleName,
      avatar: newUser.avatar,
      emailVerified: newUser.emailVerified,
    });

    const refreshToken = await jwt.signRefreshToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roleName: newUser.roleName,
      avatar: newUser.avatar,
      emailVerified: newUser.emailVerified,
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
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: newUser.email,
      subject: 'Email Verification',
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });

    res.status(200).json({
      status: true,
      message: 'User registered successful',
      data: { accessToken, refreshToken },
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ status: false, message: 'Invalid email or password' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleName: user.roleName,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
    };

    const accessToken = await jwt.signAccessToken(payload);
    const refreshToken = await jwt.signRefreshToken(payload);

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: { accessToken, refreshToken },
    });
  } catch (error: any) {
    next(createError(error));
  }
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the JWT token by setting an empty token in the response
    res.cookie('accessToken', '', { httpOnly: true, maxAge: 0 });
    res.status(200).json({ status: true, message: 'Logged out successfully' });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.query;
  try {
    const decodedToken = (await jwt.verifyEmailToken(token)) as any;
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
      emailVerified: newUser.emailVerified,
    };

    const accessToken = await jwt.signAccessToken(payload);
    const refreshToken = await jwt.signRefreshToken(payload);

    res.status(200).json({
      status: true,
      message: 'Email verificated successful, you are logged in',
      data: { accessToken, refreshToken },
    });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(
        res.status(401).json({ status: false, message: error.message })
      );
    } else {
      return next(
        res.status(500).json({ status: false, message: error.message })
      );
    }
  }
};

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body.data;

    const refreshTokenVerify = (await jwt.verifyRefreshToken(
      refreshToken
    )) as any;

    const accessToken = await jwt.signAccessToken(refreshTokenVerify.payload);

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: { accessToken, refreshToken },
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};
