import { Router, IRouter, Response } from 'express';
import { UserContext } from '../models/UserContext.model';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router: IRouter = Router();

// All routes require authentication
router.use(authMiddleware);

// Get user context
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const context = await UserContext.findOne({ userId: req.userId });

    if (!context) {
      res.status(404).json({ error: 'User context not found' });
      return;
    }

    res.status(200).json({ context });
  } catch (error) {
    console.error('Get context error:', error);
    res.status(500).json({ error: 'Failed to retrieve context' });
  }
});

// Create or update general context
router.post('/general', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { strictness, learningGoals, moodPreferences, dailyBusyLevels } = req.body;

    let context = await UserContext.findOne({ userId: req.userId });

    if (!context) {
      context = new UserContext({ userId: req.userId });
    }

    // Update general context
    if (strictness) context.generalContext.strictness = strictness;
    if (learningGoals) context.generalContext.learningGoals = learningGoals;
    if (moodPreferences) {
      context.generalContext.moodPreferences = new Map(Object.entries(moodPreferences));
    }
    if (dailyBusyLevels) {
      context.generalContext.dailyBusyLevels = new Map(Object.entries(dailyBusyLevels));
    }

    await context.save();

    res.status(200).json({
      message: 'General context updated successfully',
      context
    });
  } catch (error) {
    console.error('Update general context error:', error);
    res.status(500).json({ error: 'Failed to update general context' });
  }
});

// Create or update specific context
router.post('/specific', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workSchedule, recurringActivities } = req.body;

    let context = await UserContext.findOne({ userId: req.userId });

    if (!context) {
      context = new UserContext({ userId: req.userId });
    }

    // Update specific context
    if (workSchedule) {
      context.specificContext.workSchedule = workSchedule;
    }
    if (recurringActivities) {
      context.specificContext.recurringActivities = recurringActivities;
    }

    await context.save();

    res.status(200).json({
      message: 'Specific context updated successfully',
      context
    });
  } catch (error) {
    console.error('Update specific context error:', error);
    res.status(500).json({ error: 'Failed to update specific context' });
  }
});

export default router;

