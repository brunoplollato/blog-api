import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export const createNewCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body.data;
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Category created successful',
      data: newCategory,
    });
  } catch (error: any) {
    next(createError(error));
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error: any) {
    next(createError(error));
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { name: true },
    });
    if (!category) {
      return next(
        res
          .status(409)
          .json({ status: false, message: 'Category already exists' })
      );
    }
    res.json(category);
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name } = req.body.data;
  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Category updated successful',
      data: updatedCategory,
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ status: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};
