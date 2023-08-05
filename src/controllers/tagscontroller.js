const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createError = require('http-errors')

exports.createNewTag = async (req, res, next) => {
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
      data: newTag
    });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.getAllTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.getTagById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { name: true },
    });
    if (!tag) {
      return next(res.status(500).json({status: false, message: 'Tag not found'}));
    }
    res.json(tag);
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.updateTag = async (req, res, next) => {
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
      data: updatedTag
    });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.deleteTag = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.tag.delete({
      where: { id },
    });
    res.status(200).json({ status: true, message: 'Tag deleted successfully' });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}