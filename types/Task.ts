export type Task = {
  id: string;
  relatedApplications: string[];
  title: string;
  description: string;
  updatedAt: string;
  isCompleted: boolean;
  pomodoroCount: number; // -1 = unlimited, 0 = no target set
  completedPomodoros: number;
  experiencePoints: number;
};
