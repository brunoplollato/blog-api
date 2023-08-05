const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createError = require('http-errors')

exports.createNewCategory = async (req, res, next) => {
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
      data: newCategory
    });
  } catch (error) {
    next(createError(error))
  }
}

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    next(createError(error))
  }
}

exports.getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { name: true },
    });
    if (!category) {
      return next(res.status(409).json({status: false, message: 'Category already exists'}));
    }
    res.json(category);
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.updateCategory = async (req, res, next) => {
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
      data: updatedCategory
    });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id },
    });
    res.status(200).json({ status: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}