import express from 'express';
import {
  createNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController';
import authorize from '../middlewares/authMiddleware';

const router = express.Router();

// Create a new category
router.post('/categories', authorize(['admin', 'redator']), createNewCategory);

// Get all categories
router.get('/categories', getAllCategories);

// Get category by id
router.get('/categories/:id', getCategoryById);

// Update a category
router.put(
  '/categories/:id',
  authorize(['admin', 'redator', 'editor']),
  updateCategory
);

// Delete a category
router.delete(
  '/categories/:id',
  authorize(['admin', 'redator']),
  deleteCategory
);

export default router;
