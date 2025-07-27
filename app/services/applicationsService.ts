import connectDB from "@/db/mongodb";
import Application from "@/db/models/Application";
import { Application as ApplicationType, ApplicationStep, ApplicationStepType } from "@/types/Application";
import {
  ApplicationNotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";
import { updateApplicationsStats } from "./resumesService";
import Resume from "@/db/models/Resume";

export async function getApplications(
  userId: string,
  after?: string,
  before?: string
): Promise<ApplicationType[]> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  await connectDB();
  const query: any = { userId };
  if (after || before) {
    query.createdAt = {};
    if (after) {
      query.createdAt.$gte = new Date(after);
    }
    if (before) {
      query.createdAt.$lte = new Date(before);
    }
    // Remove createdAt if empty
    if (Object.keys(query.createdAt).length === 0) {
      delete query.createdAt;
    }
  }
  const applications = await Application.find(query).sort({
    createdAt: -1,
  });
  const resumes = await Resume.find({ userId });
  return applications.map((app) => ({
    id: app._id.toString(),
    company: app.company,
    position: app.position,
    jobSite: app.jobSite,
    steps: app.steps.map((step: any) => ({
      id: step._id.toString(),
      type: step.type,
      date: step.date.toISOString(),
      notes: step.notes,
    })),
    createdAt: app.createdAt.toISOString(),
    resume: app.resume,
    resumeLink: resumes.find((r) => r._id.toString() === app.resume)?.link,
    coverLetter: app.coverLetter,
    link: app.link,
    recruiter: app.recruiter,
  }));
}

export async function addApplication(
  application: Omit<ApplicationType, "id" | "createdAt">,
  userId: string
): Promise<ApplicationType> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  // Validate required fields
  if (
    !application.company ||
    !application.position ||
    !application.jobSite ||
    !application.steps ||
    !Array.isArray(application.steps) ||
    application.steps.length === 0
  ) {
    throw new ValidationError(
      "Missing required fields: company, position, jobSite, and at least one step are required"
    );
  }

  // Validate steps
  for (const step of application.steps) {
    if (!step.type || !step.date) {
      throw new ValidationError(
        "Each step must have type and date"
      );
    }
  }

  await connectDB();
  const newApplication = await Application.create({
    ...application,
    userId,
    steps: application.steps.map(step => ({
      ...step,
      date: new Date(step.date),
    })),
  });

  // Get the current status from the latest step for stats
  const latestStep = application.steps[application.steps.length - 1];
  await updateApplicationsStats(
    userId,
    application.resume,
    latestStep.type,
    undefined
  );

  return {
    id: newApplication._id.toString(),
    company: newApplication.company,
    position: newApplication.position,
    jobSite: newApplication.jobSite,
    steps: newApplication.steps.map((step: any) => ({
      id: step._id.toString(),
      type: step.type,
      date: step.date.toISOString(),
      notes: step.notes,
    })),
    createdAt: newApplication.createdAt.toISOString(),
    resume: newApplication.resume,
    coverLetter: newApplication.coverLetter,
    recruiter: newApplication.recruiter,
  };
}

export async function updateApplication(
  id: string,
  application: Partial<ApplicationType>,
  userId: string
): Promise<ApplicationType> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  if (!id) {
    throw new ValidationError("Application ID is required");
  }

  // Validate steps if provided
  if (application.steps) {
    for (const step of application.steps) {
      if (!step.type || !step.date) {
        throw new ValidationError(
          "Each step must have type and date"
        );
      }
    }
  }

  await connectDB();
  const updateData: any = { ...application };

  if (application.steps) {
    updateData.steps = application.steps.map(step => ({
      ...step,
      date: new Date(step.date),
    }));
  }

  const updatedApplication = await Application.findOneAndUpdate(
    { _id: id, userId },
    {
      ...updateData,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedApplication) {
    throw new ApplicationNotFoundError(id);
  }

  const resumes = await Resume.find({ userId });

  return {
    id: updatedApplication._id.toString(),
    company: updatedApplication.company,
    position: updatedApplication.position,
    jobSite: updatedApplication.jobSite,
    steps: updatedApplication.steps.map((step: any) => ({
      id: step._id.toString(),
      type: step.type,
      date: step.date.toISOString(),
      notes: step.notes,
    })),
    createdAt: updatedApplication.createdAt.toISOString(),
    resume: updatedApplication.resume,
    resumeLink: resumes.find((r) => r._id.toString() === updatedApplication.resume)?.link,
    coverLetter: updatedApplication.coverLetter,
    link: updatedApplication.link,
    recruiter: updatedApplication.recruiter,
  };
}

export async function deleteApplication(
  id: string,
  userId: string
): Promise<void> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  if (!id) {
    throw new ValidationError("Application ID is required");
  }

  await connectDB();
  const result = await Application.findOneAndDelete({ _id: id, userId });

  if (!result) {
    throw new ApplicationNotFoundError(id);
  }
}
