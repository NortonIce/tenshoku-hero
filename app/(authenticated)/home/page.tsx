import React from 'react';
import Calendar from '@/app/components/Calendar';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { getApplications } from "@/app/services/applicationsService";
import { Application } from "@/types/Application";
import HomeClient from './HomeClient';

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

function extractEventsFromApplications(applications: Application[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  
  applications.forEach(app => {
    app.steps.forEach(step => {
      // Add step date event
      events.push({
        date: step.date,
        type: 'step',
        stepType: step.type,
        company: app.company,
        position: app.position,
        notes: step.notes,
        applicationId: app.id
      });
      
      // Add due date event if it exists
      if (step.dueDate) {
        events.push({
          date: step.dueDate,
          type: 'due',
          stepType: step.type,
          company: app.company,
          position: app.position,
          notes: step.notes,
          applicationId: app.id
        });
      }
    });
  });
  
  return events;
}

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  let schedule: UserSchedule = {
    events: [],
    applicationsInPlanning: []
  };
  
  if (session?.user?.id) {
    try {
      const applications = await getApplications(session.user.id);
      const events = extractEventsFromApplications(applications);
      
      // Get applications in planning (applications with only "Applied" step)
      const applicationsInPlanning = applications
        .filter(app => app.steps.length === 1 && app.steps[0].type === 'Applied')
        .map(app => ({
          company: app.company,
          link: app.link || '',
          createdAt: app.createdAt
        }));
      
      schedule = {
        events,
        applicationsInPlanning
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }

  return <HomeClient initialSchedule={schedule} />;
} 