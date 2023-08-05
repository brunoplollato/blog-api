// routes/postRoutes.ts
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { createNewPost, getAllPosts, getPostById, getPostsByCategory, updatePost, deletePost, getPostsByTag, getPostsByAuthor, publishPost, bulkDelete, bulkPublish, unpublishPost, bulkUnpublish } = require('../controllers/postsController');
const authorize = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new post
router.post('/posts', authorize(['admin', 'redator']), createNewPost);

// Get all posts
router.get('/posts', getAllPosts);

// Get a post by ID
router.get('/posts/:id', getPostById);

// Get all posts by category
router.get('/posts/category/:categoryId', getPostsByCategory);

// Get all posts by tag
router.get('/posts/tag/:tagId', getPostsByTag);

// Get all posts by author
router.get('/posts/author/:authorId', getPostsByAuthor);

// Update a post
router.put('/posts/:id', authorize(['admin', 'redator', 'editor']), updatePost);

// Publish a post
router.post('/posts/publish/:id', authorize(['admin', 'redator', 'editor']), publishPost);

// Post bulk publish
router.post('/posts/publish', authorize(['admin', 'redator', 'editor']), bulkPublish);

// Unpublish a post
router.post('/posts/unpublish/:id', authorize(['admin', 'redator', 'editor']), unpublishPost);

// Post bulk unpublish
router.post('/posts/unpublish', authorize(['admin', 'redator', 'editor']), bulkUnpublish);

// Delete a post
router.delete('/posts/:id', authorize(['admin', 'redator']), deletePost);

// Post bulk delete
router.delete('/posts', authorize(['admin', 'redator']), bulkDelete);

module.exports = router;
