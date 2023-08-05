const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createError = require('http-errors')

exports.createNewRole = async (req, res, next) => {
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
      data: newRole
    });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.getAllRoles = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.getRoleById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const role = await prisma.role.findUnique({
      where: { id },
      include: { name: true },
    });
    if (!role) {
      return next(res.status(500).json({status: false, message: 'Role not found'}));
    }
    res.json(role);
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.updateRole = async (req, res, next) => {
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
      data: updatedRole
    });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}

exports.deleteRole = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.role.delete({
      where: { id },
    });
    res.status(200).json({ status: true, message: 'Role deleted successfully' });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
}