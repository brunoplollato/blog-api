import express from 'express';
import authRoutes from './authRoutes';
import healthCheckRoutes from './healthCheckRoutes';
import usersRoutes from './usersRoutes';
import rolesRoutes from './rolesRoutes';
import postsRoutes from './postsRoutes';
import categoriesRoutes from './categoriesRoutes';
import tagsRoutes from './tagsRoutes';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api', healthCheckRoutes);
router.use('/api', usersRoutes);
router.use('/api', rolesRoutes);
router.use('/api', postsRoutes);
router.use('/api', categoriesRoutes);
router.use('/api', tagsRoutes);

export default router;
