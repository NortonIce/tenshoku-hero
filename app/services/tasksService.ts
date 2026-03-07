import connectDB from "@/db/mongodb";
import TaskModel from "@/db/models/Task";
import { Task } from "@/types/Task";
import { UnauthorizedError, ValidationError } from "./errors";

function toDTO(doc: any): Task {
  return {
    id: doc._id.toString(),
    relatedApplications: (doc.relatedApplications || []).map((id: any) => id.toString()),
    title: doc.title,
    description: doc.description,
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : new Date().toISOString(),
    isCompleted: doc.isCompleted,
    pomodoroCount: doc.pomodoroCount,
    completedPomodoros: doc.completedPomodoros,
    experiencePoints: doc.experiencePoints,
  };
}

export async function getTasks(userId: string): Promise<Task[]> {
  await connectDB();
  const tasks = await TaskModel.find({ userId }).sort({ isCompleted: 1, updatedAt: -1 });
  return tasks.map(toDTO);
}

export async function addTask(data: Partial<Task>, userId: string): Promise<Task> {
  if (!data.title?.trim()) throw new ValidationError("Title is required");
  if (!data.description?.trim()) throw new ValidationError("Description is required");

  await connectDB();
  const task = await TaskModel.create({
    userId,
    relatedApplications: data.relatedApplications ?? [],
    title: data.title.trim(),
    description: data.description.trim(),
    isCompleted: false,
    pomodoroCount: data.pomodoroCount ?? 0,
    completedPomodoros: 0,
    experiencePoints: data.experiencePoints ?? 0,
  });
  return toDTO(task);
}

export async function updateTask(
  id: string,
  updates: Partial<Task>,
  userId: string
): Promise<Task> {
  await connectDB();
  const task = await TaskModel.findById(id);
  if (!task) throw new Error("Task not found");
  if (task.userId.toString() !== userId) throw new UnauthorizedError();

  const allowed = [
    "title",
    "description",
    "isCompleted",
    "pomodoroCount",
    "completedPomodoros",
    "experiencePoints",
    "relatedApplications",
  ] as const;

  for (const key of allowed) {
    if (key in updates && updates[key] !== undefined) {
      (task as any)[key] = updates[key];
    }
  }

  await task.save();
  return toDTO(task);
}

export async function deleteTask(id: string, userId: string): Promise<void> {
  await connectDB();
  const task = await TaskModel.findById(id);
  if (!task) throw new Error("Task not found");
  if (task.userId.toString() !== userId) throw new UnauthorizedError();
  await task.deleteOne();
}
