const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const createError = require('http-errors')

exports.createNewUser = async (req, res, next) => {
  const { name, email, roleName, password } = req.body.data;
  try {
    const hashedPassword = await bcrypt.hashSync(password, 8)
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        roleName,
        password: hashedPassword
      },
    });
    res.status(200).json({
      status: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    next(createError(error))
  }
}

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(createError(error))
  }
}

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { name: true },
    });
    if (!user) {
      return next(createError.NotFound('User not found'));
    }
    res.json(user);
  } catch (error) {
    next(createError(error))
  }
}

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, roleId } = req.body.data;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        roleId,
        password
      },
    });
    res.status(200).json({
      status: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(createError(error))
  }
}

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({
      status: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(createError(error))
  }
}