import connectDB from "@/db/mongodb";
import ResumeModel from "@/db/models/Resume";
import type { Resume } from "@/types/Resume";
import {
  ApplicationNotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";

export async function getResumes(userId: string): Promise<Resume[]> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  await connectDB();
  const resumes = await ResumeModel.find({ userId }).sort({ createdAt: -1 });
  return resumes.map((resume) => ({
    _id: resume._id.toString(),
    title: resume.title,
    notes: resume.notes,
    link: resume.link,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
    userId: resume.userId.toString(),
    applications: new Map(Object.entries(resume.applications || {})).map(
      ([key, value]) => [key, value as number]
    ),
  }));
}

export async function addResume(
  resume: Omit<Resume, "id" | "createdAt">,
  userId: string
): Promise<Resume> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  // Validate required fields
  if (!resume.title || !resume.link) {
    throw new ValidationError(
      "Missing required fields: title and link are required"
    );
  }

  await connectDB();
  const newResume = await ResumeModel.create({
    ...resume,
    userId,
  });

  return {
    _id: newResume._id.toString(),
    title: newResume.title,
    notes: newResume.notes,
    link: newResume.link,
    createdAt: newResume.createdAt.toISOString(),
    updatedAt: newResume.updatedAt.toISOString(),
    userId: newResume.userId.toString(),
  };
}

export async function updateResume(
  id: string,
  resume: Partial<Resume>,
  userId: string
): Promise<Resume> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  if (!id) {
    throw new ValidationError("Resume ID is required");
  }

  await connectDB();
  const updatedResume = await ResumeModel.findOneAndUpdate(
    { _id: id, userId },
    {
      ...resume,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!updatedResume) {
    throw new ApplicationNotFoundError(id);
  }

  return {
    _id: updatedResume._id.toString(),
    title: updatedResume.title,
    notes: updatedResume.notes,
    link: updatedResume.link,
    createdAt: updatedResume.createdAt.toISOString(),
    updatedAt: updatedResume.updatedAt.toISOString(),
    userId: updatedResume.userId.toString(),
  };
}

export async function deleteResume(id: string, userId: string): Promise<void> {
  if (!userId) {
    throw new UnauthorizedError();
  }

  if (!id) {
    throw new ValidationError("Resume ID is required");
  }

  await connectDB();
  const result = await ResumeModel.findOneAndDelete({ _id: id, userId });

  if (!result) {
    throw new ApplicationNotFoundError(id);
  }
}

export async function updateApplicationsStats(
  userId: string,
  resumeId: string | undefined,
  addedApplicationWithStatus: string | undefined,
  removedApplicationWithStatus: string | undefined
) {
  if (!userId) {
    throw new UnauthorizedError();
  }

  if (!resumeId) {
    throw new ValidationError("Resume ID is required");
  }

  await connectDB();
  const resume = await ResumeModel.findOne({ _id: resumeId, userId });

  if (!resume) {
    throw new ApplicationNotFoundError(resumeId);
  }

  // Update applications stats
  if (addedApplicationWithStatus) {
    resume.applications.set(
      addedApplicationWithStatus,
      (resume.applications.get(addedApplicationWithStatus) || 0) + 1
    );
  }

  if (removedApplicationWithStatus) {
    const currentCount =
      resume.applications.get(removedApplicationWithStatus) || 0;
    if (currentCount > 0) {
      resume.applications.set(removedApplicationWithStatus, currentCount - 1);
    }
  }

  await resume.save();
}
