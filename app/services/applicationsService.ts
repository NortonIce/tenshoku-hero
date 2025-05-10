import { Application } from "@/app/types/Applications";

const mockApplications: Application[] = [
    {
        id: "1",
        jobSite: "LinkedIn",
        recruiter: "John Smith",
        company: "Google",
        applicationDate: "2024-03-15",
        status: "Applied",
        createdAt: "2024-03-15",
        resume: "resume1.pdf",
        coverLetter: "cover1.pdf",
    },
    {
        id: "2",
        jobSite: "Indeed",
        recruiter: "Sarah Johnson",
        company: "Microsoft",
        applicationDate: "2024-03-14",
        status: "Interview",
        createdAt: "2024-03-14",
        resume: "resume2.pdf",
        coverLetter: "cover2.pdf",
    },
    {
        id: "3",
        jobSite: "Company Website",
        recruiter: "Mike Brown",
        company: "Amazon",
        applicationDate: "2024-03-13",
        status: "Rejected",
        createdAt: "2024-03-13",
        resume: "resume3.pdf",
        coverLetter: "cover3.pdf",
    },

];

export const getApplications = async (): Promise<Application[]> => {
    return [...mockApplications];
}

export const addApplication = async (application: Application): Promise<Application> => {
    mockApplications.push(application);
    return application;
}

export const updateApplication = async (id: string, updates: Partial<Application>): Promise<Application> => {
    const index = mockApplications.findIndex(app => app.id === id);
    if (index === -1) {
        throw new Error('Application not found');
    }

    mockApplications[index] = {
        ...mockApplications[index],
        ...updates,
    };

    return mockApplications[index];
}

export const deleteApplication = async (id: string): Promise<void> => {
    const index = mockApplications.findIndex(app => app.id === id);
    if (index === -1) {
        throw new Error('Application not found');
    }

    mockApplications.splice(index, 1);
}