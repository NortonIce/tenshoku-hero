import { NextResponse } from 'next/server';
import { getApplications, addApplication, updateApplication, deleteApplication } from '@/app/services/applicationsService';
import { getServerSession } from 'next-auth';
import { ApplicationNotFoundError, UnauthorizedError, ValidationError } from '@/app/services/errors';
import { authOptions } from '@/app/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        console.log('our session', session?.user?.id);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const applications = await getApplications(session.user.id);
        return NextResponse.json(applications);
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to fetch applications' },
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

        const application = await request.json();
        const newApplication = await addApplication(application, session.user.id);
        return NextResponse.json(newApplication, { status: 201 });
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create application' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        
        const { id, ...updates } = await request.json();
        console.log('PUT request received', id, updates);
        const updatedApplication = await updateApplication(id, updates, session.user.id);
        return NextResponse.json(updatedApplication);
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        if (error instanceof ApplicationNotFoundError) {
            return NextResponse.json(
                { error: error.message },
                { status: 404 }
            );
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
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
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { error: 'Application ID is required' },
                { status: 400 }
            );
        }

        await deleteApplication(id, session.user.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        if (error instanceof ApplicationNotFoundError) {
            return NextResponse.json(
                { error: error.message },
                { status: 404 }
            );
        }
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: error.message },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to delete application' },
            { status: 500 }
        );
    }
} 