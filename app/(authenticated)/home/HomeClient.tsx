'use client';

import React, { useState, useMemo } from 'react';
import Calendar from '@/app/components/Calendar';

interface CalendarEvent {
  date: string;
  type: 'step' | 'due';
  stepType: string;
  company: string;
  position: string;
  notes?: string;
  applicationId: string;
}

interface UserSchedule {
  events: CalendarEvent[];
  applicationsInPlanning: Array<{ company: string; link: string; createdAt: string }>;
}

interface HomeClientProps {
  initialSchedule: UserSchedule;
}

export default function HomeClient({ initialSchedule }: HomeClientProps) {
  const [schedule] = useState<UserSchedule>(initialSchedule);

  // Convert events to calendar format
  const calendarData = useMemo(() => {
    const eventsByDate = new Map<string, CalendarEvent[]>();
    
    // Group events by date
    schedule.events.forEach(event => {
      const dateKey = new Date(event.date).toDateString();
      if (!eventsByDate.has(dateKey)) {
        eventsByDate.set(dateKey, []);
      }
      eventsByDate.get(dateKey)!.push(event);
    });

    // Convert to calendar format
    const activeDays = Array.from(eventsByDate.entries()).map(([dateKey, events]) => ({
      datetime: new Date(dateKey).toISOString(),
      intensity: events.length, // Use event count as intensity
      events // Store events for later use
    }));

    return {
      activeDays,
      applicationsInPlanning: schedule.applicationsInPlanning
    };
  }, [schedule]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Calendar - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2">
                <Calendar
                  activeDays={calendarData.activeDays}
                  applicationsInPlanning={calendarData.applicationsInPlanning}
                />
              </div>
              
              {/* Stats Sidebar */}
              <div className="space-y-4">
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
                        {calendarData.activeDays.filter(day => {
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

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total Events</p>
                      <p className="text-xl font-semibold text-gray-900">{schedule.events.length}</p>
                      <p className="text-xs text-gray-500">Steps & Due Dates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
