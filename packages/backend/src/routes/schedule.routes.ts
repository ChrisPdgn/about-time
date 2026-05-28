import { Router, IRouter, Response } from 'express';
import { Schedule } from '../models/Schedule.model';
import { UserContext } from '../models/UserContext.model';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest, GenerateScheduleRequest } from '../types';
import { GeminiService } from '../services/gemini.service';

const router: IRouter = Router();
const geminiService = new GeminiService();

// All routes require authentication
router.use(authMiddleware);

// Generate new schedule
router.post('/generate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, startDate, endDate, additionalRequirements }: GenerateScheduleRequest = req.body;

    // Validate input
    if (!type || !startDate || !endDate) {
      res.status(400).json({ error: 'Type, startDate, and endDate are required' });
      return;
    }

    if (!['weekly', 'monthly'].includes(type)) {
      res.status(400).json({ error: 'Type must be either "weekly" or "monthly"' });
      return;
    }

    // Get user context
    const userContext = await UserContext.findOne({ userId: req.userId });
    if (!userContext) {
      res.status(404).json({ 
        error: 'User context not found. Please set up your preferences first.' 
      });
      return;
    }

    // Generate schedule using Gemini
    const timeBlocks = await geminiService.generateSchedule({
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      userContext,
      additionalRequirements
    });

    // Calculate version number (increment from latest schedule)
    const latestSchedule = await Schedule
      .findOne({ userId: req.userId, type })
      .sort({ version: -1 });
    
    const version = latestSchedule ? latestSchedule.version + 1 : 1;

    // Save schedule to database
    const schedule = await Schedule.create({
      userId: req.userId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      data: { timeBlocks },
      status: 'draft',
      version,
      additionalRequirements
    });

    res.status(201).json({
      message: 'Schedule generated successfully',
      schedule
    });
  } catch (error) {
    console.error('Schedule generation error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to generate schedule'
    });
  }
});

// Get user's schedules
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, limit = '10' } = req.query;

    const query: any = { userId: req.userId };
    if (type) {
      query.type = type;
    }

    const schedules = await Schedule
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.status(200).json({ schedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to retrieve schedules' });
  }
});

// Get specific schedule by ID
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.status(200).json({ schedule });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Failed to retrieve schedule' });
  }
});

// Update schedule status
router.patch('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status || !['draft', 'finalized'].includes(status)) {
      res.status(400).json({ error: 'Valid status is required (draft or finalized)' });
      return;
    }

    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status },
      { new: true }
    );

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.status(200).json({
      message: 'Schedule status updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Update schedule status error:', error);
    res.status(500).json({ error: 'Failed to update schedule status' });
  }
});

// Delete schedule
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router;

