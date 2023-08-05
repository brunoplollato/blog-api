import createError from 'http-errors';
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  EMAIL_TOKEN_SECRET,
} = require('../environments');

export default {
  signAccessToken(payload: any) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { payload },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' },
        (err: any, token: unknown) => {
          if (err) reject(createError(err));

          resolve(token);
        }
      );
    });
  },
  signRefreshToken(payload: any) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { payload },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' },
        (err: any, token: unknown) => {
          if (err) reject(createError(err));

          resolve(token);
        }
      );
    });
  },
  signEmailToken(payload: any) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { payload },
        EMAIL_TOKEN_SECRET,
        { expiresIn: '15m' },
        (err: any, token: unknown) => {
          if (err) reject(createError(err));

          resolve(token);
        }
      );
    });
  },
  verifyAccessToken(token: any) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        ACCESS_TOKEN_SECRET,
        (err: { name: string; message: any }, decoded: unknown) => {
          if (err) {
            const message =
              err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return reject(createError.Unauthorized(message));
          }

          resolve(decoded);
        }
      );
    });
  },
  verifyRefreshToken(token: any) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        REFRESH_TOKEN_SECRET,
        (err: { name: string; message: any }, decoded: unknown) => {
          if (err) {
            const message =
              err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return reject(createError.Unauthorized(message));
          }

          resolve(decoded);
        }
      );
    });
  },
  verifyEmailToken(token: any) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        EMAIL_TOKEN_SECRET,
        (err: { name: string; message: any }, decoded: unknown) => {
          if (err) {
            const message =
              err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return reject(createError.Unauthorized(message));
          }

          resolve(decoded);
        }
      );
    });
  },
};
