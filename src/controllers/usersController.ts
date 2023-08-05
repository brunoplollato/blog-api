const bcrypt = require('bcryptjs');
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, roleName, password } = req.body.data;
  try {
    const hashedPassword = await bcrypt.hashSync(password, 8);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        roleName,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      status: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { name: true } as any,
    });
    if (!user) {
      return next(
        res.status(500).json({ status: false, message: 'User not found' })
      );
    }
    res.json(user);
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, email, roleId } = req.body.data;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        roleId,
      } as any,
    });
    res.status(200).json({
      status: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({
      status: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};
