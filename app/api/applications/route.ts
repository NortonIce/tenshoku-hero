import { NextResponse } from 'next/server';
import { getApplications, addApplication, updateApplication, deleteApplication } from '@/app/services/applicationsService';
import { Application } from '@/app/types/Applications';

// In-memory storage for applications (replace with database in production)
let applications: Application[] = [];

export async function GET() {
    try {
        const applications = await getApplications();
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const application = await request.json();
        const newApplication = await addApplication(application);
        return NextResponse.json(newApplication, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create application' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const { id, ...updates } = await request.json();
        const updatedApplication = await updateApplication(id, updates);
        return NextResponse.json(updatedApplication);
    } catch (error) {
        if (error instanceof Error && error.message === 'Application not found') {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update application' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        await deleteApplication(id);
        return NextResponse.json({ message: 'Application deleted successfully' });
    } catch (error) {
        if (error instanceof Error && error.message === 'Application not found') {
            return NextResponse.json(
                { error: 'Application not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to delete application' },
            { status: 500 }
        );
    }
} 