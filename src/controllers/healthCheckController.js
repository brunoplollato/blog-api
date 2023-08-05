const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createError = require('http-errors')

exports.healthCheck = async (req, res, next) => {
  try {
    res.status(200).json({ status: true, message: 'API status: Online' });
  } catch (error) {
    next(res.status(500).json({status: false, message: error.message}));
  }
};