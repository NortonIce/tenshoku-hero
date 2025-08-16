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
import { convertApplicationToDTO } from "./dataConverter";

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
  return applications.map((app) => {
    const resumeLink = resumes.find((r) => r._id.toString() === app.resume)?.link;
    return convertApplicationToDTO(app, resumeLink);
  });
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
    !application.steps ||
    !Array.isArray(application.steps) ||
    application.steps.length === 0
  ) {
    throw new ValidationError(
      "Missing required fields: company, position, and at least one step are required"
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

  return convertApplicationToDTO(newApplication);
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
  const resumeLink = resumes.find((r) => r._id.toString() === updatedApplication.resume)?.link;

  return convertApplicationToDTO(updatedApplication, resumeLink);
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
