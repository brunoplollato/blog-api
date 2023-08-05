import { Request, Response, NextFunction } from 'express';

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ status: true, message: 'API status: Online' });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};
