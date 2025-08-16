import { Application as ApplicationType, ApplicationStep } from "@/types/Application";

/**
 * Converts a database step object to an ApplicationStep DTO
 */
export function convertStepToDTO(step: any): ApplicationStep {
  return {
    id: step._id.toString(),
    type: step.type,
    date: step.date.toISOString(),
    dueDate: step.dueDate,
    notes: step.notes,
    order: step.order,
  };
}

/**
 * Converts a database application object to an Application DTO
 */
export function convertApplicationToDTO(
  application: any,
  resumeLink?: string
): ApplicationType {
  return {
    id: application._id.toString(),
    company: application.company,
    position: application.position,
    jobSite: application.jobSite,
    steps: application.steps.map((step: any) => convertStepToDTO(step)),
    createdAt: application.createdAt.toISOString(),
    resume: application.resume,
    resumeLink: resumeLink,
    coverLetter: application.coverLetter,
    link: application.link,
    recruiter: application.recruiter,
  };
}
