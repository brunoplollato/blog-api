const express = require('express');
const authRoutes = require('./authRoutes');
const healthCheckRoutes = require('./healthCheckRoutes');
const usersRoutes = require('./usersRoutes');
const rolesRoutes = require('./rolesRoutes');
const postsRoutes = require('./postsRoutes');
const categoriesRoutes = require('./categoriesRoutes');
const tagsRoutes = require('./tagsRoutes');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api', healthCheckRoutes);
router.use('/api', usersRoutes);
router.use('/api', rolesRoutes);
router.use('/api', postsRoutes);
router.use('/api', categoriesRoutes);
router.use('/api', tagsRoutes);

module.exports = router;
