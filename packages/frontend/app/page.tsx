'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            About Time
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Your AI-powered scheduling buddy
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Create personalized weekly and monthly schedules with the help of AI.
            Set your preferences, describe your commitments, and let us handle the rest.
          </p>
          
          <div className="flex gap-4 justify-center pt-8">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold text-lg mb-2">Set Your Context</h3>
              <p className="text-gray-600">
                Tell us about your preferences, work schedule, and recurring activities
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Planning</h3>
              <p className="text-gray-600">
                Our AI generates personalized schedules based on your unique needs
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="font-semibold text-lg mb-2">Export & Share</h3>
              <p className="text-gray-600">
                Download as PDF or send via email to stay organized
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
