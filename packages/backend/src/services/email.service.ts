import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

export class EmailService {
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || '';
    if (!this.fromEmail) {
      console.warn('SENDGRID_FROM_EMAIL is not defined');
    }
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY is not defined');
      }

      if (!this.fromEmail) {
        throw new Error('SENDGRID_FROM_EMAIL is not defined');
      }

      const msg = {
        to: params.to,
        from: this.fromEmail,
        subject: params.subject,
        html: params.html,
        attachments: params.attachments || []
      };

      await sgMail.send(msg);
      console.log('Email sent successfully to:', params.to);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendScheduleEmail(to: string, schedulePdf: Buffer, scheduleName: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Schedule from About Time</h2>
        <p>Hello!</p>
        <p>Your personalized schedule is attached to this email.</p>
        <p>We hope this helps you stay organized and productive!</p>
        <br>
        <p>Best regards,<br>About Time Team</p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject: `Your ${scheduleName} Schedule`,
      html,
      attachments: [{
        content: schedulePdf.toString('base64'),
        filename: `${scheduleName}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }]
    });
  }
}

