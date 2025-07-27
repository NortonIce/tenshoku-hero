import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getApplications } from '@/app/services/applicationsService';
import { UnauthorizedError } from '@/app/services/errors';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get all applications for the user
        const applications = await getApplications(session.user.id);

        const totalApplications = applications.length;

        // Count applications with take home assignments
        const takeHomeAssignments = applications.filter(app =>
            app.steps.some(step => step.type === 'Take Home Assignment')
        ).length;

        // Count applications with interviews (including Phone Screen, Interview, Final Interview)
        const interviews = applications.filter(app =>
            app.steps.some(step =>
                ['Phone Screen', 'Interview', 'Final Interview'].includes(step.type)
            )
        ).length;

        // Count applications with offers
        const offers = applications.filter(app =>
            app.steps.some(step => step.type === 'Offer')
        ).length;

        // Calculate percentages
        const takeHomePercentage = totalApplications > 0
            ? Math.round((takeHomeAssignments / totalApplications) * 100)
            : 0;

        const interviewsPercentage = totalApplications > 0
            ? Math.round((interviews / totalApplications) * 100)
            : 0;

        // Calculate offer percentage
        const offerPercentage = totalApplications > 0
            ? Math.round((offers / totalApplications) * 100)
            : 0;


        // Calculate daily new applications for the past year
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const applicationsForPasrYear = await getApplications(session.user.id, oneYearAgo.toISOString());
        const dailyApplications = applicationsForPasrYear.reduce((acc: any, app: any) => {
            // app.createdAt is already an ISO string, so just split it
            const date = app.createdAt.split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        const dailyApplicationsArray = Object.entries(dailyApplications).map(([date, count]) => ({ date, count }));
        const stats = {
            totalApplications,
            takeHomeAssignments: {
                count: takeHomeAssignments,
                percentage: takeHomePercentage
            },
            interviews: {
                count: interviews,
                percentage: interviewsPercentage
            },
            offers: {
                count: offers,
                percentage: offerPercentage
            },
            dailyApplications: dailyApplicationsArray
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
