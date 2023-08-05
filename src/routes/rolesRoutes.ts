// routes/roleRoutes.js
import express from 'express';
import {
  createNewRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from '../controllers/rolesController';
import authorize from '../middlewares/authMiddleware';

const router = express.Router();

// Create a new role
router.post('/roles', authorize(['admin']), createNewRole);

// Get all roles
router.get('/roles', getAllRoles);

// Get role by id
router.get('/roles/:id', getRoleById);

// Update a role
router.put('/roles/:id', authorize(['admin']), updateRole);

// Delete a role
router.delete('/roles/:id', authorize(['admin']), deleteRole);

export default router;
