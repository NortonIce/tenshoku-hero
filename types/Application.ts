export type Application = {
    id: string;
    company: string;
    position: string;
    jobSite: string;
    status: 'Applied' | 'Take home assignment' | 'Interview' | 'Rejected' | 'Offer';
    applicationDate: string;
    createdAt: string;
    resume?: string;
    coverLetter?: string;
    recruiter?: string;
}