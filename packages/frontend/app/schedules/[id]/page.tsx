'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';
import { Download, Mail, RefreshCw } from 'lucide-react';

interface TimeBlock {
  day: string;
  startTime: string;
  endTime: string;
  activity: string;
  category: string;
  description?: string;
}

interface Schedule {
  _id: string;
  type: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  data: {
    timeBlocks: TimeBlock[];
  };
  status: 'draft' | 'finalized';
  version: number;
  createdAt: string;
}

const categoryColors: Record<string, string> = {
  work: 'bg-blue-100 text-blue-700 border-blue-300',
  exercise: 'bg-green-100 text-green-700 border-green-300',
  learning: 'bg-purple-100 text-purple-700 border-purple-300',
  meal: 'bg-orange-100 text-orange-700 border-orange-300',
  personal: 'bg-pink-100 text-pink-700 border-pink-300',
  social: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  sleep: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  free: 'bg-gray-100 text-gray-700 border-gray-300',
};

export default function ScheduleDetailPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const scheduleId = params.id as string;
  
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const response = await api.getSchedule(scheduleId);
        setSchedule(response.schedule);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load schedule');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && scheduleId) {
      loadSchedule();
    }
  }, [user, scheduleId]);

  const handleDownloadPDF = async () => {
    try {
      const blob = await api.downloadSchedulePDF(scheduleId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedule-${schedule?.type}-${format(new Date(schedule?.startDate || ''), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to download PDF');
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setIsSendingEmail(true);
    try {
      await api.emailSchedule(scheduleId, email);
      alert('Schedule sent successfully!');
      setShowEmailInput(false);
      setEmail('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleRegenerate = () => {
    router.push('/schedules/generate');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 mb-4">{error || 'Schedule not found'}</p>
            <Link href="/schedules">
              <Button>Back to Schedules</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group time blocks by day
  const blocksByDay: Record<string, TimeBlock[]> = {};
  schedule.data.timeBlocks.forEach(block => {
    if (!blocksByDay[block.day]) {
      blocksByDay[block.day] = [];
    }
    blocksByDay[block.day].push(block);
  });

  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedDays = Object.keys(blocksByDay).sort((a, b) => 
    dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

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
              {user?.name || user?.email}
            </span>
            <Button variant="outline" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/schedules" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
              ← Back to Schedules
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2 capitalize">{schedule.type} Schedule</h2>
                <p className="text-gray-600">
                  {format(new Date(schedule.startDate), 'MMMM d')} - {format(new Date(schedule.endDate), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Version {schedule.version} • Created {format(new Date(schedule.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                schedule.status === 'finalized' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {schedule.status}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mb-6 flex-wrap">
            <Button onClick={handleDownloadPDF} variant="default">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {showEmailInput ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  autoFocus
                />
                <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                  {isSendingEmail ? 'Sending...' : 'Send'}
                </Button>
                <Button variant="outline" onClick={() => setShowEmailInput(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setShowEmailInput(true)} variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send via Email
              </Button>
            )}
            <Button onClick={handleRegenerate} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New
            </Button>
          </div>

          <div className="space-y-6">
            {sortedDays.map(day => (
              <Card key={day}>
                <CardHeader>
                  <CardTitle className="text-xl">{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {blocksByDay[day]
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((block, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-l-4 ${
                            categoryColors[block.category] || categoryColors.free
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-semibold">
                                  {block.startTime} - {block.endTime}
                                </span>
                                <span className="text-xs px-2 py-1 rounded bg-white border uppercase font-medium">
                                  {block.category}
                                </span>
                              </div>
                              <h4 className="font-medium text-lg">{block.activity}</h4>
                              {block.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {block.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedDays.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No time blocks in this schedule</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

