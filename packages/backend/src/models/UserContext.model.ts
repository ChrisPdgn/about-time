import mongoose, { Document, Schema, Types } from 'mongoose';
import { GeneralContext, SpecificContext } from '../types';

export interface IUserContext extends Document {
  userId: Types.ObjectId;
  generalContext: GeneralContext;
  specificContext: SpecificContext;
  updatedAt: Date;
}

const userContextSchema = new Schema<IUserContext>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  generalContext: {
    strictness: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    learningGoals: [{
      type: String
    }],
    moodPreferences: {
      type: Map,
      of: String,
      default: new Map()
    },
    dailyBusyLevels: {
      type: Map,
      of: String,
      default: new Map()
    }
  },
  specificContext: {
    workSchedule: {
      days: [{
        type: String
      }],
      startTime: String,
      endTime: String,
      commute: {
        type: Number,
        default: 0
      }
    },
    recurringActivities: [{
      name: {
        type: String,
        required: true
      },
      frequency: {
        type: Number,
        required: true
      },
      duration: {
        type: Number,
        required: true
      },
      preferredTimes: [{
        type: String
      }]
    }]
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
userContextSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const UserContext = mongoose.model<IUserContext>('UserContext', userContextSchema);

