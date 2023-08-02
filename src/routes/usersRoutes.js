/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - roleName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of your user
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         roleName:
 *           type: string
 *           description: The user role name
 *         verified:
 *           type: boolean
 *           description: The user email verified
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the user was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the user was updated
 *       example:
 *         id: 8391b771-8030-4538-b05b-52021cb1776a
 *         name: Alexander K. Dewdney
 *         email: alexanderk.dewdney@gmail.com
 *         password: 12345
 *         verified: false
 *         roleName: user
 *         createdAt: 2020-01-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 */
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *
 */
const express = require('express');
const { createNewUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/usersController');
const authorize = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new user
router.post('/users', authorize(['admin']), createNewUser);

// Get all users
router.get('/users', getAllUsers);

// Get user by id
router.get('/users/:id', getUserById);

// Update a user
router.put('/users/:id', authorize(['admin']), updateUser);

// Delete a user
router.delete('/users/:id', authorize(['admin']), deleteUser);

module.exports = router;
