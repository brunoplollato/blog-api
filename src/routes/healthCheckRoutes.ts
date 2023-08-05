import express from 'express';
import { healthCheck } from '../controllers/healthCheckController';

const router = express.Router();

// Register
router.get('/healthCheck', healthCheck);

// Get all users

export default router;
