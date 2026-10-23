import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema
} from '../validators/task.validator.js';

const router = Router();

// Protect all task endpoints
router.use(protect);

router.route('/')
  .post(validate(createTaskSchema), taskController.createTask)
  .get(taskController.getTasks);

router.route('/:taskId')
  .get(taskController.getTaskById)
  .patch(validate(updateTaskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

router.patch('/:taskId/status', validate(updateStatusSchema), taskController.updateTaskStatus);
router.get('/:taskId/activity', taskController.getTaskActivities);

export default router;
