import express from 'express';
import authorize from '../middlewares/authMiddleware';
import {
  createNewUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/usersController';

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

export default router;
