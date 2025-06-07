import connectDB from '@/db/mongodb';
import ResumeModel from '@/db/models/Resume';
import type { Resume } from '@/types/Resume';
import { ApplicationNotFoundError, UnauthorizedError, ValidationError } from './errors';

export async function getResumes(userId: string): Promise<Resume[]> {
    if (!userId) {
        throw new UnauthorizedError();
    }

    await connectDB();
    const resumes = await ResumeModel.find({ userId }).sort({ createdAt: -1 });
    return resumes.map(resume => ({
        _id: resume._id.toString(),
        title: resume.title,
        notes: resume.notes,
        link: resume.link,
        createdAt: resume.createdAt.toISOString(),
        updatedAt: resume.updatedAt.toISOString(),
        userId: resume.userId.toString(),
    }));
}

export async function addResume(resume: Omit<Resume, 'id' | 'createdAt'>, userId: string): Promise<Resume> {
    if (!userId) {
        throw new UnauthorizedError();
    }

    // Validate required fields
    if (!resume.title || !resume.link) {
        throw new ValidationError('Missing required fields: title and link are required');
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

export async function updateResume(id: string, resume: Partial<Resume>, userId: string): Promise<Resume> {
    if (!userId) {
        throw new UnauthorizedError();
    }

    if (!id) {
        throw new ValidationError('Resume ID is required');
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
        throw new ValidationError('Resume ID is required');
    }

    await connectDB();
    const result = await ResumeModel.findOneAndDelete({ _id: id, userId });
    
    if (!result) {
        throw new ApplicationNotFoundError(id);
    }
}

// export class ResumesService {
//   private resumes: Resume[] = [];

//   async createResume(resume: Resume): Promise<Resume> {
//     this.resumes.push(resume);
//     return resume;
//   }

//   async getResumes(): Promise<Resume[]> {
//     return this.resumes;
//   }

//   async getResumeById(_id: string): Promise<Resume | null> {
//     return this.resumes.find(resume => resume._id === _id) || null;
//   }

//   async updateResume(_id: string, updates: Partial<Resume>): Promise<Resume | null> {
//     const index = this.resumes.findIndex(resume => resume._id === _id);
//     if (index === -1) return null;

//     this.resumes[index] = { ...this.resumes[index], ...updates };
//     return this.resumes[index];
//   }

//   async deleteResume(_id: string): Promise<boolean> {
//     const index = this.resumes.findIndex(resume => resume._id === _id);
//     if (index === -1) return false;

//     this.resumes.splice(index, 1);
//     return true;
//   }
// } 