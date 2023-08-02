// routes/roleRoutes.js
const express = require('express');
const { createNewRole, getAllRoles, getRoleById, updateRole, deleteRole } = require('../controllers/rolesController');
const authorize = require('../middlewares/authMiddleware');

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

module.exports = router;
