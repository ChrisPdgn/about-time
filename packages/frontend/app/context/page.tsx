'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ContextPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // General Context
  const [strictness, setStrictness] = useState<'flexible' | 'moderate' | 'strict'>('moderate');
  const [learningGoals, setLearningGoals] = useState('');
  
  // Specific Context
  const [workDays, setWorkDays] = useState('Monday,Tuesday,Wednesday,Thursday,Friday');
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');
  const [commute, setCommute] = useState('15');
  const [gymFrequency, setGymFrequency] = useState('3');
  const [gymDuration, setGymDuration] = useState('60');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Load existing context
    const loadContext = async () => {
      try {
        const response = await api.getContext();
        const context = response.context;
        
        if (context) {
          setStrictness(context.generalContext.strictness || 'moderate');
          setLearningGoals(context.generalContext.learningGoals?.join(', ') || '');
          
          if (context.specificContext.workSchedule) {
            const ws = context.specificContext.workSchedule;
            setWorkDays(ws.days?.join(',') || '');
            setWorkStart(ws.startTime || '09:00');
            setWorkEnd(ws.endTime || '17:00');
            setCommute(ws.commute?.toString() || '15');
          }
          
          const gymActivity = context.specificContext.recurringActivities?.find(
            (a: any) => a.name.toLowerCase().includes('gym')
          );
          if (gymActivity) {
            setGymFrequency(gymActivity.frequency.toString());
            setGymDuration(gymActivity.duration.toString());
          }
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          console.error('Failed to load context:', err);
        }
      }
    };
    
    if (user) {
      loadContext();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      // Update general context
      await api.updateGeneralContext({
        strictness,
        learningGoals: learningGoals.split(',').map(g => g.trim()).filter(g => g),
        moodPreferences: {},
        dailyBusyLevels: {}
      });

      // Update specific context
      await api.updateSpecificContext({
        workSchedule: {
          days: workDays.split(',').map(d => d.trim()).filter(d => d),
          startTime: workStart,
          endTime: workEnd,
          commute: parseInt(commute) || 0
        },
        recurringActivities: [
          {
            name: 'Gym',
            frequency: parseInt(gymFrequency) || 0,
            duration: parseInt(gymDuration) || 60,
            preferredTimes: []
          }
        ]
      });

      setMessage('Context saved successfully!');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save context');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
              About Time
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name || user.email}
            </span>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Set Your Context</h2>
            <p className="text-gray-600">
              Tell us about your preferences and commitments so we can generate better schedules
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className="bg-green-50 text-green-600 p-4 rounded-md">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md">
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>General Preferences</CardTitle>
                <CardDescription>
                  Your general planning style and goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Planning Strictness</Label>
                  <select
                    value={strictness}
                    onChange={(e) => setStrictness(e.target.value as any)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="moderate">Moderate</option>
                    <option value="strict">Strict</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learningGoals">Learning Goals (comma-separated)</Label>
                  <Input
                    id="learningGoals"
                    placeholder="e.g. Learn Spanish, Practice coding, Read more books"
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Schedule</CardTitle>
                <CardDescription>
                  Your regular work commitments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workDays">Work Days (comma-separated)</Label>
                  <Input
                    id="workDays"
                    placeholder="Monday,Tuesday,Wednesday,Thursday,Friday"
                    value={workDays}
                    onChange={(e) => setWorkDays(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workStart">Start Time</Label>
                    <Input
                      id="workStart"
                      type="time"
                      value={workStart}
                      onChange={(e) => setWorkStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workEnd">End Time</Label>
                    <Input
                      id="workEnd"
                      type="time"
                      value={workEnd}
                      onChange={(e) => setWorkEnd(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commute">Commute (minutes one way)</Label>
                  <Input
                    id="commute"
                    type="number"
                    value={commute}
                    onChange={(e) => setCommute(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recurring Activities</CardTitle>
                <CardDescription>
                  Activities you do regularly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gymFrequency">Gym (times per week)</Label>
                    <Input
                      id="gymFrequency"
                      type="number"
                      value={gymFrequency}
                      onChange={(e) => setGymFrequency(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gymDuration">Duration (minutes)</Label>
                    <Input
                      id="gymDuration"
                      type="number"
                      value={gymDuration}
                      onChange={(e) => setGymDuration(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : 'Save Context'}
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

