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
import { addDays, addMonths, format } from 'date-fns';

export default function GenerateSchedulePage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));
  const [requirements, setRequirements] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Auto-update end date when type changes
    const start = new Date(startDate);
    if (type === 'weekly') {
      setEndDate(format(addDays(start, 7), 'yyyy-MM-dd'));
    } else {
      setEndDate(format(addMonths(start, 1), 'yyyy-MM-dd'));
    }
  }, [type, startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.generateSchedule({
        type,
        startDate,
        endDate,
        additionalRequirements: requirements || undefined
      });

      // Redirect to the generated schedule
      router.push(`/schedules/${response.schedule._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate schedule');
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
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Generate Schedule</h2>
            <p className="text-gray-600">
              Create a new AI-powered schedule based on your context
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Schedule Details</CardTitle>
                <CardDescription>
                  Configure your new schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Schedule Type</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'weekly' | 'monthly')}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Additional Requirements (optional)</Label>
                  <textarea
                    id="requirements"
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
                    placeholder="e.g., This week I need to prepare for a presentation, so please allocate extra time for that"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Make sure you've set your context preferences before generating a schedule.
                    The AI will use your work schedule, learning goals, and other preferences to create a personalized plan.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 mt-6">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Generating...' : 'Generate Schedule'}
              </Button>
              <Link href="/schedules" className="flex-1">
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

