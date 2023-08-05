import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createNewTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body.data;
  try {
    const newTag = await prisma.tag.create({
      data: {
        name,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Tag created successfully',
      data: newTag,
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const getAllTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const getTagById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { name: true } as any,
    });
    if (!tag) {
      return next(
        res.status(500).json({ status: false, message: 'Tag not found' })
      );
    }
    res.json(tag);
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name } = req.body.data;
  try {
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name,
      },
    });
    res.status(200).json({
      status: true,
      message: 'Tag updated successfully',
      data: updatedTag,
    });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};

export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    await prisma.tag.delete({
      where: { id },
    });
    res.status(200).json({ status: true, message: 'Tag deleted successfully' });
  } catch (error: any) {
    next(res.status(500).json({ status: false, message: error.message }));
  }
};
