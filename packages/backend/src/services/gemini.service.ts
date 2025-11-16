import { GoogleGenerativeAI } from '@google/generative-ai';
import { IUserContext } from '../models/UserContext.model';
import { ScheduleTimeBlock } from '../types';

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

interface ScheduleGenerationParams {
  type: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  userContext: IUserContext;
  additionalRequirements?: string;
}

export class GeminiService {
  private model;

  constructor() {
    if (!genAI) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  private buildPrompt(params: ScheduleGenerationParams): string {
    const { type, startDate, endDate, userContext, additionalRequirements } = params;

    const generalCtx = userContext.generalContext;
    const specificCtx = userContext.specificContext;

    let prompt = `You are a personal scheduling assistant. Generate a ${type} schedule from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}.\n\n`;

    prompt += `**User Preferences:**\n`;
    prompt += `- Planning Style: ${generalCtx.strictness}\n`;
    
    if (generalCtx.learningGoals && generalCtx.learningGoals.length > 0) {
      prompt += `- Learning Goals: ${generalCtx.learningGoals.join(', ')}\n`;
    }

    if (generalCtx.moodPreferences && generalCtx.moodPreferences.size > 0) {
      prompt += `- Daily Mood Preferences: ${JSON.stringify(Object.fromEntries(generalCtx.moodPreferences))}\n`;
    }

    if (generalCtx.dailyBusyLevels && generalCtx.dailyBusyLevels.size > 0) {
      prompt += `- Daily Busy Levels: ${JSON.stringify(Object.fromEntries(generalCtx.dailyBusyLevels))}\n`;
    }

    prompt += `\n**Fixed Commitments:**\n`;
    
    if (specificCtx.workSchedule) {
      const ws = specificCtx.workSchedule;
      prompt += `- Work: ${ws.days.join(', ')} from ${ws.startTime} to ${ws.endTime}`;
      if (ws.commute > 0) {
        prompt += ` (${ws.commute} min commute each way)`;
      }
      prompt += `\n`;
    }

    if (specificCtx.recurringActivities && specificCtx.recurringActivities.length > 0) {
      prompt += `- Recurring Activities:\n`;
      specificCtx.recurringActivities.forEach(activity => {
        prompt += `  * ${activity.name}: ${activity.frequency} times per ${type === 'weekly' ? 'week' : 'month'}, ${activity.duration} minutes each`;
        if (activity.preferredTimes && activity.preferredTimes.length > 0) {
          prompt += ` (preferred: ${activity.preferredTimes.join(', ')})`;
        }
        prompt += `\n`;
      });
    }

    if (additionalRequirements) {
      prompt += `\n**Additional Requirements:**\n${additionalRequirements}\n`;
    }

    prompt += `\n**Instructions:**\n`;
    prompt += `1. Create a realistic and balanced schedule\n`;
    prompt += `2. Include all fixed commitments (work, recurring activities)\n`;
    prompt += `3. Add time for meals, breaks, and sleep\n`;
    prompt += `4. Consider the user's mood preferences and busy level for each day\n`;
    prompt += `5. Include time blocks for learning goals if specified\n`;
    prompt += `6. Leave some buffer/free time for flexibility\n\n`;

    prompt += `**Output Format:**\n`;
    prompt += `Return ONLY a valid JSON object with this structure (no markdown, no extra text):\n`;
    prompt += `{\n`;
    prompt += `  "timeBlocks": [\n`;
    prompt += `    {\n`;
    prompt += `      "day": "Monday",\n`;
    prompt += `      "startTime": "09:00",\n`;
    prompt += `      "endTime": "17:00",\n`;
    prompt += `      "activity": "Work",\n`;
    prompt += `      "category": "work",\n`;
    prompt += `      "description": "Office work including commute"\n`;
    prompt += `    }\n`;
    prompt += `  ]\n`;
    prompt += `}\n\n`;
    prompt += `Categories: work, exercise, learning, meal, personal, social, sleep, free\n`;

    return prompt;
  }

  async generateSchedule(params: ScheduleGenerationParams): Promise<ScheduleTimeBlock[]> {
    try {
      const prompt = this.buildPrompt(params);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to extract JSON from the response
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON object boundaries
      const startIdx = jsonText.indexOf('{');
      const endIdx = jsonText.lastIndexOf('}');
      
      if (startIdx === -1 || endIdx === -1) {
        throw new Error('No valid JSON found in response');
      }
      
      jsonText = jsonText.substring(startIdx, endIdx + 1);

      const parsed = JSON.parse(jsonText);

      if (!parsed.timeBlocks || !Array.isArray(parsed.timeBlocks)) {
        throw new Error('Invalid schedule format: missing timeBlocks array');
      }

      return parsed.timeBlocks as ScheduleTimeBlock[];
    } catch (error) {
      console.error('Gemini generation error:', error);
      throw new Error(`Failed to generate schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

