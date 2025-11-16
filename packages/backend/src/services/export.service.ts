import puppeteer from 'puppeteer';
import { ISchedule } from '../models/Schedule.model';

export class ExportService {
  private generateScheduleHTML(schedule: ISchedule): string {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const categoriesColors: Record<string, string> = {
      work: '#3b82f6',
      exercise: '#10b981',
      learning: '#8b5cf6',
      meal: '#f59e0b',
      personal: '#ec4899',
      social: '#06b6d4',
      sleep: '#6366f1',
      free: '#94a3b8'
    };

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1e293b;
            font-size: 32px;
            margin-bottom: 10px;
          }
          .header p {
            color: #64748b;
            font-size: 14px;
          }
          .schedule-info {
            margin-bottom: 30px;
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
          }
          .schedule-info p {
            margin: 5px 0;
            color: #475569;
          }
          .time-block {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 4px solid #3b82f6;
            background: #f8fafc;
            border-radius: 4px;
            page-break-inside: avoid;
          }
          .time-block h3 {
            color: #1e293b;
            font-size: 18px;
            margin-bottom: 10px;
          }
          .activity {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            margin: 8px 0;
            background: white;
            border-radius: 6px;
            border-left: 3px solid;
          }
          .activity-time {
            font-weight: bold;
            color: #475569;
            min-width: 120px;
          }
          .activity-details {
            flex: 1;
            margin-left: 15px;
          }
          .activity-name {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
          }
          .activity-desc {
            font-size: 13px;
            color: #64748b;
          }
          .category-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            color: white;
            text-transform: uppercase;
          }
          .legend {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
          }
          .legend h4 {
            margin-bottom: 15px;
            color: #475569;
          }
          .legend-items {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .legend-item {
            display: flex;
            align-items: center;
            padding: 6px 12px;
            background: #f8fafc;
            border-radius: 6px;
          }
          .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 3px;
            margin-right: 8px;
          }
          .legend-text {
            font-size: 13px;
            color: #475569;
            text-transform: capitalize;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>About Time - Your Schedule</h1>
          <p>AI-Powered Personalized Schedule</p>
        </div>

        <div class="schedule-info">
          <p><strong>Type:</strong> ${schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}</p>
          <p><strong>Period:</strong> ${formatDate(schedule.startDate)} - ${formatDate(schedule.endDate)}</p>
          <p><strong>Generated:</strong> ${formatDate(schedule.createdAt)}</p>
          ${schedule.additionalRequirements ? `<p><strong>Requirements:</strong> ${schedule.additionalRequirements}</p>` : ''}
        </div>
    `;

    // Group time blocks by day
    const blocksByDay: Record<string, typeof schedule.data.timeBlocks> = {};
    schedule.data.timeBlocks.forEach(block => {
      if (!blocksByDay[block.day]) {
        blocksByDay[block.day] = [];
      }
      blocksByDay[block.day].push(block);
    });

    // Sort days
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sortedDays = Object.keys(blocksByDay).sort((a, b) => {
      return dayOrder.indexOf(a) - dayOrder.indexOf(b);
    });

    // Generate HTML for each day
    sortedDays.forEach(day => {
      html += `
        <div class="time-block">
          <h3>${day}</h3>
      `;

      blocksByDay[day]
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .forEach(block => {
          const color = categoriesColors[block.category] || '#94a3b8';
          html += `
            <div class="activity" style="border-left-color: ${color}">
              <div class="activity-time">${block.startTime} - ${block.endTime}</div>
              <div class="activity-details">
                <div class="activity-name">
                  ${block.activity}
                  <span class="category-badge" style="background-color: ${color}">${block.category}</span>
                </div>
                ${block.description ? `<div class="activity-desc">${block.description}</div>` : ''}
              </div>
            </div>
          `;
        });

      html += `</div>`;
    });

    // Add legend
    const usedCategories = new Set(schedule.data.timeBlocks.map(b => b.category));
    html += `
      <div class="legend">
        <h4>Categories</h4>
        <div class="legend-items">
    `;

    usedCategories.forEach(category => {
      const color = categoriesColors[category] || '#94a3b8';
      html += `
        <div class="legend-item">
          <div class="legend-color" style="background-color: ${color}"></div>
          <div class="legend-text">${category}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
      </body>
      </html>
    `;

    return html;
  }

  async generatePDF(schedule: ISchedule): Promise<Buffer> {
    let browser;
    try {
      const html = this.generateScheduleHTML(schedule);

      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      return Buffer.from(pdf);
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

