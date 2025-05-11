import connectDB from '@/lib/db/mongodb';
import Application from '@/lib/db/models/Application';
import { Application as ApplicationType } from '@/types/Applications';
import { ApplicationNotFoundError, UnauthorizedError, ValidationError } from './errors';

export async function getApplications(userId: string): Promise<ApplicationType[]> {
    if (!userId) {
        throw new UnauthorizedError();
    }

    await connectDB();
    const applications = await Application.find({ userId }).sort({ createdAt: -1 });
    return applications.map(app => ({
        id: app._id.toString(),
        company: app.company,
        jobSite: app.jobSite,
        status: app.status,
        applicationDate: app.applicationDate.toISOString(),
        createdAt: app.createdAt.toISOString(),
        resume: app.resume,
        coverLetter: app.coverLetter,
        recruiter: app.recruiter,
    }));
}

export async function addApplication(application: Omit<ApplicationType, 'id' | 'createdAt'>, userId: string): Promise<ApplicationType> {
    if (!userId) {
        throw new UnauthorizedError();
    }

    // Validate required fields
    if (!application.company || !application.jobSite || !application.status || !application.applicationDate) {
        throw new ValidationError('Missing required fields: company, jobSite, status, and applicationDate are required');
    }

    // Validate status
    const validStatuses = ['Applied', 'Take home assignment', 'Interview', 'Rejected', 'Offer'];
    if (!validStatuses.includes(application.status)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    await connectDB();
    const newApplication = await Application.create({
        ...application,
        userId,
        applicationDate: new Date(application.applicationDate),
    });

    return {
        id: newApplication._id.toString(),
        company: newApplication.company,
        jobSite: newApplication.jobSite,
        status: newApplication.status,
        applicationDate: newApplication.applicationDate.toISOString(),
        createdAt: newApplication.createdAt.toISOString(),
        resume: newApplication.resume,
        coverLetter: newApplication.coverLetter,
        recruiter: newApplication.recruiter,
    };
}

export async function updateApplication(id: string, application: Partial<ApplicationType>, userId: string): Promise<ApplicationType> {
    if (!userId) {
        throw new UnauthorizedError();
    }

    if (!id) {
        throw new ValidationError('Application ID is required');
    }

    // Validate status if provided
    if (application.status) {
        const validStatuses = ['Applied', 'Take home assignment', 'Interview', 'Rejected', 'Offer'];
        if (!validStatuses.includes(application.status)) {
            throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }
    }

    await connectDB();
    const updatedApplication = await Application.findOneAndUpdate(
        { _id: id, userId },
        { 
            ...application,
            ...(application.applicationDate && { applicationDate: new Date(application.applicationDate) }),
            updatedAt: new Date(),
        },
        { new: true }
    );

    if (!updatedApplication) {
        throw new ApplicationNotFoundError(id);
    }

    return {
        id: updatedApplication._id.toString(),
        company: updatedApplication.company,
        jobSite: updatedApplication.jobSite,
        status: updatedApplication.status,
        applicationDate: updatedApplication.applicationDate.toISOString(),
        createdAt: updatedApplication.createdAt.toISOString(),
        resume: updatedApplication.resume,
        coverLetter: updatedApplication.coverLetter,
        recruiter: updatedApplication.recruiter,
    };
}

export async function deleteApplication(id: string, userId: string): Promise<void> {
    if (!userId) {
        throw new UnauthorizedError();
    }

    if (!id) {
        throw new ValidationError('Application ID is required');
    }

    await connectDB();
    const result = await Application.findOneAndDelete({ _id: id, userId });
    
    if (!result) {
        throw new ApplicationNotFoundError(id);
    }
}