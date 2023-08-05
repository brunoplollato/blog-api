import { Request, Response, NextFunction } from 'express';
import jwt from '../utils/jwt';
import createError from 'http-errors';

const authorize =
  (roles: string | any[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Authorization token not found' });
    }

    try {
      const { payload }: any = await jwt.verifyAccessToken(token);
      const { id, roleName, emailVerified } = payload;

      if (!roles.includes(roleName))
        return next(
          res.status(401).json({
            status: 'error',
            message: 'Unauthorized access, need the right role',
          })
        );

      if (!emailVerified)
        return next(
          res
            .status(401)
            .json({ status: 'error', message: 'Email not verified' })
        );

      next();
    } catch (error: any) {
      return next(createError(error));
    }
  };

export default authorize;
