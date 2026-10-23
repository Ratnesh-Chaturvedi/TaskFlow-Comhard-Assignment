import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';
import TaskActivity from '../models/TaskActivity.js';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/status.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing data for demo user
    const demoEmail = 'ratnesh@example.com';
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      await TaskActivity.deleteMany({ user: existingUser._id });
      await Task.deleteMany({ user: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log('[Seed] Removed old demo user data');
    }

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const user = await User.create({
      name: 'Ratnesh C.',
      email: demoEmail,
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    console.log(`[Seed] Created demo user: ${user.name} (${user.email}) / password123`);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const in2Days = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    const in3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in5Days = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
    const in7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);

    const tasksData = [
      // 1. Featured tasks from UI screenshot with SLA
      {
        title: 'Design new landing page',
        description: 'Create high-converting modern landing page mockup with Figma, focusing on hero visuals and pricing table.',
        status: TASK_STATUS.CREATED,
        priority: TASK_PRIORITY.HIGH,
        dueDate: today,
        tags: ['Design', 'UI/UX', 'Marketing'],
        category: 'Design',
        slaEnabled: true,
        slaDurationMinutes: 480, // 8 hours
        slaStartType: 'creation',
        slaDeadline: new Date(now.getTime() + 300 * 60000), // ~5h left (On Track)
        currentStatusSince: new Date(now.getTime() - 135 * 60000), // 2h 15m ago
        timeInCreated: 135 * 60000
      },
      {
        title: 'Fix authentication bug',
        description: 'Resolve token refresh mismatch issue when user signs in from multiple tabs simultaneously.',
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: tomorrow,
        tags: ['Backend', 'Security', 'Bug'],
        category: 'Engineering',
        startedAt: new Date(now.getTime() - 330 * 60000), // 5h 30m ago
        currentStatusSince: new Date(now.getTime() - 330 * 60000),
        timeInCreated: 135 * 60000,
        timeInProgress: 330 * 60000,
        slaEnabled: true,
        slaDurationMinutes: 360, // 6 hours
        slaStartType: 'first_start',
        slaDeadline: new Date(now.getTime() + 30 * 60000), // 30m left (At Risk!)
        statusHistory: [
          { fromStatus: '', toStatus: 'Created', transitionAt: new Date(now.getTime() - 465 * 60000), durationSeconds: 8100 },
          { fromStatus: 'Created', toStatus: 'In Progress', transitionAt: new Date(now.getTime() - 330 * 60000), durationSeconds: 19800 }
        ]
      },
      {
        title: 'Prepare presentation',
        description: 'Assemble slide deck for Q4 product roadmap review with engineering leads and stakeholders.',
        status: TASK_STATUS.COMPLETED,
        priority: TASK_PRIORITY.LOW,
        dueDate: in2Days,
        startedAt: new Date(now.getTime() - 30 * 3600000),
        completedAt: yesterday,
        currentStatusSince: yesterday,
        timeInCreated: 2 * 3600000,
        timeInProgress: 5.5 * 3600000,
        timeInCompleted: 24 * 3600000,
        tags: ['Strategy', 'Presentation'],
        category: 'Management',
        slaEnabled: true,
        slaDurationMinutes: 720,
        slaStartType: 'creation',
        slaDeadline: in2Days, // Met SLA!
        statusHistory: [
          { fromStatus: '', toStatus: 'Created', transitionAt: twoDaysAgo, durationSeconds: 7200 },
          { fromStatus: 'Created', toStatus: 'In Progress', transitionAt: new Date(twoDaysAgo.getTime() + 7200000), durationSeconds: 19800 },
          { fromStatus: 'In Progress', toStatus: 'Completed', transitionAt: yesterday, durationSeconds: 86400 }
        ]
      },
      {
        title: 'Update documentation',
        description: 'Audit REST API documentation on Swagger and update endpoints for v1 tasks.',
        status: TASK_STATUS.CREATED,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: in3Days,
        tags: ['Docs', 'API'],
        category: 'Engineering',
        slaEnabled: true,
        slaDurationMinutes: 1440,
        slaStartType: 'creation',
        slaDeadline: in3Days
      },

      // 2. Active Breached SLA task for realistic reporting
      {
        title: 'Review production security headers',
        description: 'Verify CSP, HSTS, and X-Content-Type-Options headers in Helmet middleware.',
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.URGENT,
        dueDate: yesterday,
        startedAt: twoDaysAgo,
        currentStatusSince: twoDaysAgo,
        timeInCreated: 3600000,
        timeInProgress: 48 * 3600000,
        tags: ['Security', 'DevOps'],
        category: 'Engineering',
        slaEnabled: true,
        slaDurationMinutes: 1440, // 24 hours
        slaStartType: 'creation',
        slaDeadline: yesterday // Breached!
      },

      // 3. More In-Progress and Completed tasks
      {
        title: 'Implement Kanban drag-and-drop',
        description: 'Integrate @dnd-kit with optimistic status updates and server persistence.',
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.URGENT,
        dueDate: tomorrow,
        startedAt: new Date(now.getTime() - 120 * 60000),
        currentStatusSince: new Date(now.getTime() - 120 * 60000),
        timeInCreated: 60 * 60000,
        timeInProgress: 120 * 60000,
        tags: ['Frontend', 'Kanban'],
        category: 'Engineering',
        slaEnabled: true,
        slaDurationMinutes: 480,
        slaStartType: 'first_start',
        slaDeadline: new Date(now.getTime() + 360 * 60000) // On Track
      },
      {
        title: 'Setup Vite and Tailwind CSS build system',
        description: 'Configure PostCSS, Autoprefixer, typography plugin, and custom color tokens.',
        status: TASK_STATUS.COMPLETED,
        priority: TASK_PRIORITY.HIGH,
        dueDate: twoDaysAgo,
        startedAt: twoDaysAgo,
        completedAt: twoDaysAgo,
        currentStatusSince: twoDaysAgo,
        timeInCreated: 1800000,
        timeInProgress: 7200000,
        tags: ['Frontend', 'Setup'],
        category: 'Engineering',
        slaEnabled: true,
        slaDurationMinutes: 300,
        slaDeadline: twoDaysAgo
      }
    ];

    console.log(`[Seed] Inserting ${tasksData.length} tasks with SLA metrics...`);
    for (const t of tasksData) {
      const task = await Task.create({
        ...t,
        user: user._id
      });

      await TaskActivity.create({
        task: task._id,
        user: user._id,
        action: 'created',
        description: `Task created with status "${task.status}" and priority "${task.priority}"`
      });
    }

    console.log('[Seed] Database seeded with SLA and Lifecycle data successfully! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDatabase();
