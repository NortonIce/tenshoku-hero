export type ApplicationStepType =
  | "Applied"
  | "Phone Screen"
  | "Take Home Assignment"
  | "Interview"
  | "Final Interview"
  | "Reference Check"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

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
  resumeLink?: string;
  coverLetter?: string;
  link?: string;
  recruiter?: string;
};
