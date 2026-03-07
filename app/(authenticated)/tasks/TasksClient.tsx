"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Task } from "@/types/Task";
import { Application } from "@/types/Application";
import TaskModal from "@/app/components/TaskModal";
import { PrimaryButton } from "@/app/components/buttons/PrimaryButton";
import { renderDescriptionWithLinks } from "@/app/utils/parseLinks";

const POMODORO_SECONDS = 25 * 60;

type PomodoroState = "idle" | "running" | "paused" | "done";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ─── Pomodoro progress dots ──────────────────────────────────────────────────

function ProgressDots({
  completed,
  total,
  size = "md",
}: {
  completed: number;
  total: number;
  size?: "sm" | "md";
}) {
  const dot = size === "sm" ? "w-2.5 h-2.5" : "w-4 h-4";
  const MAX = size === "sm" ? 10 : 20;

  if (total === 0 && completed === 0) return null;

  // Specific target that fits in dots
  if (total > 0 && total <= MAX) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`${dot} rounded-full transition-colors ${
              i < completed
                ? "bg-orange-500"
                : "border-2 border-gray-300 bg-white"
            }`}
          />
        ))}
      </div>
    );
  }

  // Large specific target: progress bar
  if (total > MAX) {
    const pct = Math.min(100, (completed / total) * 100);
    return (
      <div className="space-y-1 w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{completed} done</span>
          <span>{total} total</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  // Unlimited (-1) or no target (0) but has completions
  const dotCount = Math.min(completed, MAX);
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: dotCount }).map((_, i) => (
          <div key={i} className={`${dot} rounded-full bg-orange-500`} />
        ))}
        {completed > MAX && (
          <span className="text-xs text-gray-500">+{completed - MAX}</span>
        )}
      </div>
      {total === -1 && (
        <div className="text-xs text-gray-400">{completed} / ∞</div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewedTask, setViewedTask] = useState<Task | null>(null);

  // Pomodoro
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_SECONDS);
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>("idle");
  const activeTaskIdRef = useRef<string | null>(null);
  const tasksRef = useRef<Task[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Absolute timestamp when the current run ends; null when paused/idle
  const endTimeRef = useRef<number | null>(null);
  // Remaining seconds saved at pause time
  const pausedSecondsRef = useRef<number>(POMODORO_SECONDS);

  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  useEffect(() => { activeTaskIdRef.current = activeTaskId; }, [activeTaskId]);

  // Keep detail panel in sync when tasks update
  useEffect(() => {
    if (!viewedTask) return;
    const fresh = tasks.find((t) => t.id === viewedTask.id);
    if (fresh) setViewedTask(fresh);
    else setViewedTask(null);
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error();
      setTasks(await res.json());
      setError(null);
    } catch {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.ok ? r.json() : [])
      .then(setApplications)
      .catch(() => {});
  }, []);

  // ── Pomodoro logic ───────────────────────────────────────────────────────

  const completePomodoro = useCallback(async (taskId: string) => {
    const task = tasksRef.current.find((t) => t.id === taskId);
    if (!task) return;
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, completedPomodoros: task.completedPomodoros + 1 }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      }
    } catch {}
  }, []);

  // Derives remaining seconds from the absolute endTime on every tick.
  // Accurate regardless of how much the browser throttles the interval.
  useEffect(() => {
    if (pomodoroState !== "running") return;

    const tick = () => {
      if (!endTimeRef.current) return;
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(timerRef.current!);
        setPomodoroState("done");
        if (activeTaskIdRef.current) completePomodoro(activeTaskIdRef.current);
      }
    };

    tick(); // Immediate update so display is correct right away
    timerRef.current = setInterval(tick, 500); // 500 ms keeps display smooth

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [pomodoroState, completePomodoro]);

  // Snap the display the moment the user returns to the tab
  useEffect(() => {
    if (pomodoroState !== "running") return;

    const onVisible = () => {
      if (document.hidden || !endTimeRef.current) return;
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPomodoroState("done");
        if (activeTaskIdRef.current) completePomodoro(activeTaskIdRef.current);
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [pomodoroState, completePomodoro]);

  const startPomodoro = (taskId: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    endTimeRef.current = Date.now() + POMODORO_SECONDS * 1000;
    pausedSecondsRef.current = POMODORO_SECONDS;
    setActiveTaskId(taskId);
    setSecondsLeft(POMODORO_SECONDS);
    setPomodoroState("running");
  };

  const pausePomodoro = () => {
    // Save how many seconds remain so resume can reconstruct endTime
    pausedSecondsRef.current = endTimeRef.current
      ? Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
      : secondsLeft;
    endTimeRef.current = null;
    setPomodoroState("paused"); // effect cleanup clears the interval
  };

  const resumePomodoro = () => {
    endTimeRef.current = Date.now() + pausedSecondsRef.current * 1000;
    setPomodoroState("running"); // effect starts a new interval
  };

  const stopPomodoro = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    endTimeRef.current = null;
    pausedSecondsRef.current = POMODORO_SECONDS;
    setActiveTaskId(null);
    setSecondsLeft(POMODORO_SECONDS);
    setPomodoroState("idle");
  };

  // ── CRUD ────────────────────────────────────────────────────────────────

  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, isCompleted: !task.isCompleted }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      }
    } catch {}
  };

  const handleModalSubmit = async (data: Partial<Task>) => {
    try {
      if (modalMode === "add") {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const created = await res.json();
          setTasks((prev) => [created, ...prev]);
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedTask?.id, ...data }),
        });
        if (res.ok) {
          const updated = await res.json();
          setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
          setIsModalOpen(false);
          setSelectedTask(null);
        }
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setIsModalOpen(false);
        setSelectedTask(null);
        if (viewedTask?.id === id) setViewedTask(null);
        if (activeTaskId === id) stopPomodoro();
      }
    } catch {}
  };

  const openEdit = (task: Task) => {
    setModalMode("edit");
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const activePomodoroTask = tasks.find((t) => t.id === activeTaskId);
  const hasActivePomodoro = pomodoroState !== "idle";

  // Show floating bar only when detail panel is NOT showing the active task
  const showFloatingBar = hasActivePomodoro && viewedTask?.id !== activeTaskId;

  return (
    <div className="flex flex-col flex-1 min-h-0 relative">
      {/* Header */}
      <div className="flex m-2 justify-between items-center flex-wrap gap-2">
        <PrimaryButton
          onClick={() => {
            setModalMode("add");
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Task
        </PrimaryButton>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ minWidth: 220 }}
        />
      </div>

      <div className="mx-2 mb-1 text-sm text-gray-500">
        {search
          ? `${filteredTasks.length} of ${tasks.length} tasks`
          : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
      </div>

      {/* Split layout: list + detail panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Task list — hidden on mobile when detail panel is open */}
        <div
          className={`flex-1 overflow-y-auto px-2 ${
            showFloatingBar ? "pb-20" : "pb-4"
          } ${viewedTask ? "hidden md:block" : "block"}`}
        >
          {error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              {search ? "No tasks match your search." : "No tasks yet. Create your first task!"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isActive={task.id === activeTaskId}
                  isViewed={task.id === viewedTask?.id}
                  onView={() =>
                    setViewedTask(viewedTask?.id === task.id ? null : task)
                  }
                  onToggleComplete={() => handleToggleComplete(task)}
                  onEdit={() => openEdit(task)}
                  onStartPomodoro={() => startPomodoro(task.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Task detail panel */}
        {viewedTask && (
          <div
            className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-l border-gray-200 overflow-y-auto ${
              showFloatingBar ? "pb-20" : "pb-4"
            }`}
          >
            <TaskDetailPanel
              task={viewedTask}
              applications={applications}
              isActiveTask={activeTaskId === viewedTask.id}
              pomodoroState={pomodoroState}
              secondsLeft={secondsLeft}
              onStart={() => startPomodoro(viewedTask.id)}
              onPause={pausePomodoro}
              onResume={resumePomodoro}
              onStop={stopPomodoro}
              onEdit={() => openEdit(viewedTask)}
              onClose={() => setViewedTask(null)}
            />
          </div>
        )}
      </div>

      {/* Floating timer — shown when active pomodoro is not visible in detail panel */}
      {showFloatingBar && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between shadow-lg transition-colors ${
            pomodoroState === "done" ? "bg-green-600" : pomodoroState === "paused" ? "bg-amber-600" : "bg-blue-700"
          } text-white`}
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-2xl font-mono font-bold tabular-nums flex-shrink-0">
              {formatTime(secondsLeft)}
            </span>
            <div className="min-w-0">
              <div className="text-xs opacity-75">
                {pomodoroState === "done"
                  ? "🎉 Pomodoro complete!"
                  : pomodoroState === "paused"
                  ? "⏸ Paused"
                  : "🍅 In progress"}
              </div>
              <div className="font-medium truncate">{activePomodoroTask?.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            {pomodoroState === "running" && (
              <button
                onClick={pausePomodoro}
                className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
              >
                Pause
              </button>
            )}
            {pomodoroState === "paused" && (
              <button
                onClick={resumePomodoro}
                className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
              >
                Resume
              </button>
            )}
            <button
              onClick={stopPomodoro}
              className="px-3 py-1.5 rounded bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
            >
              {pomodoroState === "done" ? "Dismiss" : "Stop"}
            </button>
          </div>
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedTask(null); }}
        onSubmit={handleModalSubmit}
        onDelete={handleDelete}
        task={selectedTask}
        mode={modalMode}
        applications={applications}
      />
    </div>
  );
}

// ─── Task card (list item) ────────────────────────────────────────────────────

function TaskCard({
  task,
  isActive,
  isViewed,
  onView,
  onToggleComplete,
  onEdit,
  onStartPomodoro,
}: {
  task: Task;
  isActive: boolean;
  isViewed: boolean;
  onView: () => void;
  onToggleComplete: () => void;
  onEdit: () => void;
  onStartPomodoro: () => void;
}) {
  const hasPomodoros = task.completedPomodoros > 0 || task.pomodoroCount !== 0;

  return (
    <div
      onClick={onView}
      className={`rounded-lg border bg-white px-4 py-3 flex items-start gap-3 transition-all cursor-pointer ${
        isViewed
          ? "border-blue-500 ring-1 ring-blue-400 bg-blue-50/30"
          : isActive
          ? "border-blue-300 ring-1 ring-blue-200"
          : "border-gray-200 hover:border-gray-300"
      } ${task.isCompleted ? "opacity-60" : ""}`}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleComplete(); }}
        title={task.isCompleted ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          task.isCompleted
            ? "bg-blue-600 border-blue-600"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        {task.isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-gray-900 ${task.isCompleted ? "line-through text-gray-400" : ""}`}>
          {task.title}
        </div>
        {task.description && (
          <div className="mt-1 text-sm text-gray-500 line-clamp-2 whitespace-pre-wrap break-words">
            {renderDescriptionWithLinks(task.description)}
          </div>
        )}
        {hasPomodoros && (
          <div className="mt-2">
            <ProgressDots completed={task.completedPomodoros} total={task.pomodoroCount} size="sm" />
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 flex-shrink-0 mt-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onStartPomodoro}
          title="Start Pomodoro (25 min)"
          className={`p-1.5 rounded text-lg leading-none transition-colors ${
            isActive ? "bg-orange-100 text-orange-600" : "hover:bg-orange-50 text-orange-400 hover:text-orange-600"
          }`}
        >
          🍅
        </button>
        <button
          onClick={onEdit}
          title="Edit task"
          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Task detail panel ────────────────────────────────────────────────────────

function TaskDetailPanel({
  task,
  applications,
  isActiveTask,
  pomodoroState,
  secondsLeft,
  onStart,
  onPause,
  onResume,
  onStop,
  onEdit,
  onClose,
}: {
  task: Task;
  applications: Application[];
  isActiveTask: boolean;
  pomodoroState: PomodoroState;
  secondsLeft: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onEdit: () => void;
  onClose: () => void;
}) {
  const totalLabel =
    task.pomodoroCount === -1
      ? "∞"
      : task.pomodoroCount > 0
      ? String(task.pomodoroCount)
      : null;

  const timerStatus =
    isActiveTask && pomodoroState !== "idle"
      ? pomodoroState === "done"
        ? "done"
        : pomodoroState === "paused"
        ? "paused"
        : "running"
      : null;

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
        {/* Back (mobile) / close (desktop) */}
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="md:hidden">Back</span>
        </button>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Title */}
        <div>
          <h2 className={`text-lg font-semibold text-gray-900 ${task.isCompleted ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </h2>
          {task.isCompleted && (
            <span className="mt-1 inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
            {renderDescriptionWithLinks(task.description)}
          </div>
        )}

        {/* Linked applications */}
        {task.relatedApplications.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Linked Applications</h3>
            <div className="space-y-1.5">
              {task.relatedApplications.map((appId) => {
                const app = applications.find((a) => a.id === appId);
                if (!app) return null;
                return (
                  <div
                    key={appId}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-gray-50 border border-gray-200 text-sm"
                  >
                    <div className="min-w-0">
                      <span className="font-medium text-gray-800 truncate block">{app.company}</span>
                      <span className="text-gray-500 text-xs truncate block">{app.position}</span>
                    </div>
                    {app.link && (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View job posting"
                        className="flex-shrink-0 text-blue-500 hover:text-blue-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pomodoro section */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              🍅 Pomodoro
            </h3>
            {(task.completedPomodoros > 0 || task.pomodoroCount !== 0) && (
              <span className="text-xs text-gray-500">
                {task.completedPomodoros}
                {totalLabel ? ` / ${totalLabel}` : " done"}
              </span>
            )}
          </div>

          {/* Progress visualization */}
          <ProgressDots
            completed={task.completedPomodoros}
            total={task.pomodoroCount}
            size="md"
          />

          {/* Timer display */}
          {isActiveTask && pomodoroState !== "idle" && (
            <div className="mt-5 text-center">
              <div
                className={`text-5xl font-mono font-bold tabular-nums ${
                  timerStatus === "done"
                    ? "text-green-600"
                    : timerStatus === "paused"
                    ? "text-amber-600"
                    : "text-blue-700"
                }`}
              >
                {formatTime(secondsLeft)}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {timerStatus === "done"
                  ? "🎉 Pomodoro complete!"
                  : timerStatus === "paused"
                  ? "Paused — resume when ready"
                  : "Focus time"}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
            {/* Start / Start new */}
            {(!isActiveTask || pomodoroState === "idle" || pomodoroState === "done") && (
              <PrimaryButton onClick={onStart} className="gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                {pomodoroState === "done" && isActiveTask ? "Start New" : "Start Pomodoro"}
              </PrimaryButton>
            )}

            {/* Pause */}
            {isActiveTask && pomodoroState === "running" && (
              <button
                onClick={onPause}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </button>
            )}

            {/* Resume */}
            {isActiveTask && pomodoroState === "paused" && (
              <PrimaryButton onClick={onResume} className="gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </PrimaryButton>
            )}

            {/* Stop */}
            {isActiveTask && pomodoroState !== "idle" && (
              <button
                onClick={onStop}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
