import { z } from 'zod';
import { STATUS_LIST, PRIORITY_LIST } from '../constants/status.js';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Task title is required').max(200, 'Title cannot exceed 200 characters'),
    description: z.string().trim().optional().default(''),
    status: z.enum(STATUS_LIST).optional(),
    priority: z.enum(PRIORITY_LIST).optional(),
    startDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),
    tags: z.array(z.string()).optional().default([]),
    category: z.string().trim().optional().default(''),
    // SLA options
    slaEnabled: z.boolean().optional().default(true),
    slaDurationMinutes: z.number().int().min(1, 'SLA duration must be at least 1 minute').max(525600).optional().default(480),
    slaStartType: z.enum(['creation', 'first_start']).optional().default('creation')
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Task title cannot be empty').max(200).optional(),
    description: z.string().trim().optional(),
    status: z.enum(STATUS_LIST).optional(),
    priority: z.enum(PRIORITY_LIST).optional(),
    startDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().trim().optional(),
    // SLA options
    slaEnabled: z.boolean().optional(),
    slaDurationMinutes: z.number().int().min(1).max(525600).optional(),
    slaStartType: z.enum(['creation', 'first_start']).optional()
  })
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(STATUS_LIST, {
      errorMap: () => ({ message: `Status must be one of: ${STATUS_LIST.join(', ')}` })
    })
  })
});
