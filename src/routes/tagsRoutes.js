// routes/tagRoutes.js
const express = require('express');
const { createNewTag, getAllTags, getTagById, updateTag, deleteTag } = require('../controllers/tagscontroller');
const authorize = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new tag
router.post('/tags', authorize(['admin', 'redator']), createNewTag);

// Get all tags
router.get('/tags', getAllTags);

// Get tag by id
router.get('/tags/:id', getTagById);

// Update a tag
router.put('/tags/:id', authorize(['admin', 'redator', 'editor']), updateTag);

// Delete a tag
router.delete('/tags/:id', authorize(['admin', 'redator']), deleteTag);

module.exports = router;
