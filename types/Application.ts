export type ApplicationStepType =
  | "Applied"
  | "Recieved Take Home Assignment"
  | "Sent Take Home Assignment"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Ignored";

export type ApplicationStep = {
  id: string;
  type: ApplicationStepType;
  date: string;
  dueDate?: string;
  notes?: string;
  order: number;
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
