import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createNewRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body.data;
  try {
    const newRole = await prisma.role.create({
      data: {
        name,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Role created successfully',
      data: newRole,
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: { name: true } as any,
    });
    if (!role) {
      return next(
        res.status(500).json({ status: false, message: 'Role not found' })
      );
    }
    res.json(role);
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name } = req.body.data;
  try {
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Role updated successfully',
      data: updatedRole,
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.role.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ status: true, message: 'Role deleted successfully' });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};
