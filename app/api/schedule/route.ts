import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import UserSchedule from '@/db/models/UserSchedule';
import connectDB from '@/db/mongodb';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get or create user schedule
        let schedule = await UserSchedule.findOne({ userId: session.user.id });
        
        if (!schedule) {
            // Create a new schedule with some sample data
            schedule = new UserSchedule({
                userId: session.user.id,
                activeDays: [],
                applicationsInPlanning: []
            });
            await schedule.save();
        }

        return NextResponse.json({
            activeDays: schedule.activeDays,
            applicationsInPlanning: schedule.applicationsInPlanning
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        return NextResponse.json(
            { error: 'Failed to fetch schedule' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { activeDays, applicationsInPlanning } = await request.json();

        await connectDB();

        // Update or create user schedule
        const schedule = await UserSchedule.findOneAndUpdate(
            { userId: session.user.id },
            {
                userId: session.user.id,
                activeDays,
                applicationsInPlanning,
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            activeDays: schedule.activeDays,
            applicationsInPlanning: schedule.applicationsInPlanning
        });
    } catch (error) {
        console.error('Error updating schedule:', error);
        return NextResponse.json(
            { error: 'Failed to update schedule' },
            { status: 500 }
        );
    }
}
