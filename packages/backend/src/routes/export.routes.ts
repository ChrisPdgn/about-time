import { Router, IRouter, Response } from 'express';
import { Schedule } from '../models/Schedule.model';
import { User } from '../models/User.model';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';
import { ExportService } from '../services/export.service';
import { EmailService } from '../services/email.service';

const router: IRouter = Router();
const exportService = new ExportService();
const emailService = new EmailService();

// All routes require authentication
router.use(authMiddleware);

// Export schedule as PDF (download)
router.get('/:id/pdf', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    const pdfBuffer = await exportService.generatePDF(schedule);

    const filename = `schedule-${schedule.type}-${schedule.startDate.toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Send schedule via email
router.post('/:id/email', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email address is required' });
      return;
    }

    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    // Generate PDF
    const pdfBuffer = await exportService.generatePDF(schedule);

    // Get schedule name
    const scheduleName = `${schedule.type}-${schedule.startDate.toISOString().split('T')[0]}`;

    // Send email
    await emailService.sendScheduleEmail(email, pdfBuffer, scheduleName);

    res.status(200).json({
      message: 'Schedule sent successfully via email'
    });
  } catch (error) {
    console.error('Email export error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to send email'
    });
  }
});

export default router;

