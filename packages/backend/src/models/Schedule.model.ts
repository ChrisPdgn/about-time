import mongoose, { Document, Schema, Types } from 'mongoose';
import { ScheduleTimeBlock } from '../types';

export interface ISchedule extends Document {
  userId: Types.ObjectId;
  type: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  data: {
    timeBlocks: ScheduleTimeBlock[];
  };
  status: 'draft' | 'finalized';
  version: number;
  additionalRequirements?: string;
  createdAt: Date;
}

const scheduleSchema = new Schema<ISchedule>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['weekly', 'monthly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  data: {
    timeBlocks: [{
      day: {
        type: String,
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      activity: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      description: String
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'finalized'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  additionalRequirements: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
scheduleSchema.index({ userId: 1, createdAt: -1 });
scheduleSchema.index({ userId: 1, type: 1, startDate: 1 });

export const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);

