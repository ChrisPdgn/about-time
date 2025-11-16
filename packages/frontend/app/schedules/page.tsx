'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

interface Schedule {
  _id: string;
  type: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  status: 'draft' | 'finalized';
  version: number;
  createdAt: string;
}

export default function SchedulesPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const response = await api.getSchedules();
        setSchedules(response.schedules);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load schedules');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadSchedules();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await api.deleteSchedule(id);
      setSchedules(schedules.filter(s => s._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete schedule');
    }
  };

  if (authLoading || isLoading) {
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Schedules</h2>
              <p className="text-gray-600">
                View and manage your generated schedules
              </p>
            </div>
            <Link href="/schedules/generate">
              <Button>Generate New Schedule</Button>
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {schedules.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500 mb-4">No schedules yet. Create your first one!</p>
                <Link href="/schedules/generate">
                  <Button>Generate Schedule</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedules.map((schedule) => (
                <Card key={schedule._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{schedule.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        schedule.status === 'finalized' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {schedule.status}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(schedule.startDate), 'MMM d')} - {format(new Date(schedule.endDate), 'MMM d, yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Version {schedule.version}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created {format(new Date(schedule.createdAt), 'MMM d, yyyy')}
                    </p>
                    <div className="flex gap-2 pt-4">
                      <Link href={`/schedules/${schedule._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(schedule._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

