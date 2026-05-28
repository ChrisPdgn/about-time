import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface ScheduleTimeBlock {
  day: string;
  startTime: string;
  endTime: string;
  activity: string;
  category: string;
  description?: string;
}

export interface GenerateScheduleRequest {
  type: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  additionalRequirements?: string;
}

export interface GeneralContext {
  strictness: 'flexible' | 'moderate' | 'strict';
  learningGoals: string[];
  moodPreferences: Map<string, string>;
  dailyBusyLevels: Map<string, string>;
}

export interface WorkSchedule {
  days: string[];
  startTime: string;
  endTime: string;
  commute: number;
}

export interface RecurringActivity {
  name: string;
  frequency: number;
  duration: number;
  preferredTimes?: string[];
}

export interface SpecificContext {
  workSchedule: WorkSchedule;
  recurringActivities: RecurringActivity[];
}

