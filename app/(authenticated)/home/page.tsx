'use client';

import React, { useEffect, useState } from 'react';
import Calendar from '@/app/components/Calendar';

interface UserSchedule {
  activeDays: Array<{ intensity: number; datetime: string }>;
  applicationsInPlanning: Array<{ company: string; link: string; createdAt: string }>;
}

export default function HomePage() {
  const [schedule, setSchedule] = useState<UserSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/schedule');
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        setSchedule(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

    return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Loading/Error States */}
            {loading && (
              <div className="text-center py-8 text-gray-500">Loading your schedule...</div>
            )}
            {error && (
              <div className="text-center py-8 text-red-500">{error}</div>
            )}
 
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Calendar - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2">
                <Calendar
                  activeDays={schedule?.activeDays || []}
                  applicationsInPlanning={schedule?.applicationsInPlanning || []}
                />
              </div>
              
              {/* Stats Sidebar */}
              <div className="space-y-4">
                {schedule && (
                  <>
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Active Days</p>
                          <p className="text-xl font-semibold text-gray-900">
                            {schedule.activeDays.filter(day => {
                              const date = new Date(day.datetime);
                              const now = new Date();
                              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                            }).length}
                          </p>
                          <p className="text-xs text-gray-500">This month</p>
                        </div>
                      </div>
                    </div>
 
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">In Planning</p>
                          <p className="text-xl font-semibold text-gray-900">{schedule.applicationsInPlanning.length}</p>
                          <p className="text-xs text-gray-500">Applications</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 