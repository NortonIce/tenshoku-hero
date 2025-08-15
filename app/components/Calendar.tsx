'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CalendarDay {
  date: Date;
  intensity?: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface CalendarProps {
  activeDays?: Array<{ intensity: number; datetime: Date | string }>;
  applicationsInPlanning?: Array<{ company: string; link: string; createdAt: Date | string }>;
}

export default function Calendar({ activeDays = [], applicationsInPlanning = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, activeDays]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a map of active days for quick lookup
    const activeDayMap = new Map<string, number>();
    activeDays.forEach(day => {
      const date = new Date(day.datetime);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      activeDayMap.set(dateKey, day.intensity);
    });

    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDayOfCalendar);
      date.setDate(firstDayOfCalendar.getDate() + i);
      
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      const intensity = activeDayMap.get(dateKey);
      
      days.push({
        date: new Date(date),
        intensity,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime()
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getIntensityColor = (intensity?: number) => {
    if (!intensity) return 'bg-gray-50';
    if (intensity <= 2) return 'bg-green-100';
    if (intensity <= 4) return 'bg-green-200';
    if (intensity <= 6) return 'bg-green-300';
    if (intensity <= 8) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getIntensityTextColor = (intensity?: number) => {
    if (!intensity) return 'text-gray-700';
    if (intensity <= 4) return 'text-gray-700';
    return 'text-white';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              aspect-square flex items-center justify-center text-xs rounded transition-colors cursor-pointer
              ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
              ${day.isToday ? 'ring-1 ring-blue-500' : ''}
              ${getIntensityColor(day.intensity)}
              ${getIntensityTextColor(day.intensity)}
              hover:bg-gray-100
            `}
            title={day.intensity ? `Activity intensity: ${day.intensity}` : ''}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>

      {applicationsInPlanning.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Applications in Planning</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {applicationsInPlanning.slice(0, 3).map((app, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                <span className="text-gray-700 truncate">{app.company}</span>
                <a
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex-shrink-0 ml-2"
                >
                  View
                </a>
              </div>
            ))}
            {applicationsInPlanning.length > 3 && (
              <p className="text-xs text-gray-500 text-center py-1">
                +{applicationsInPlanning.length - 3} more
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-center space-x-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-50 rounded"></div>
          <span>None</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-200 rounded"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded"></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
