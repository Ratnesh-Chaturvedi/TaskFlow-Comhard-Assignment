import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/me', userController.getProfile);
router.patch('/me', userController.updateProfile);
router.post('/change-password', userController.changePassword);

export default router;
