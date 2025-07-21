export type ApplicationStepType = 
    | 'Applied'
    | 'Phone Screen'
    | 'Take Home Assignment'
    | 'Interview Round 1'
    | 'Interview Round 2'
    | 'Interview Round 3'
    | 'Final Interview'
    | 'Reference Check'
    | 'Offer'
    | 'Rejected'
    | 'Withdrawn';

export type ApplicationStep = {
    id: string;
    type: ApplicationStepType;
    date: string;
    notes?: string;
};

export type Application = {
    id: string;
    company: string;
    position: string;
    jobSite: string;
    steps: ApplicationStep[];
    createdAt: string;
    resume?: string;
    coverLetter?: string;
    recruiter?: string;
}