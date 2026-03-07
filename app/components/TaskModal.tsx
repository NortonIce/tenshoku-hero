"use client";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { Task } from "@/types/Task";
import { Application } from "@/types/Application";
import { renderDescriptionWithLinks } from "@/app/utils/parseLinks";
import Select from "react-select";

type AppOption = { value: string; label: string };

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => void;
  onDelete?: (id: string) => void;
  task?: Task | null;
  mode: "add" | "edit";
  applications?: Application[];
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  task,
  mode,
  applications = [],
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [relatedApplications, setRelatedApplications] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const appOptions: AppOption[] = applications.map((app) => ({
    value: app.id,
    label: `${app.company} — ${app.position}`,
  }));

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description);
      setPomodoroCount(task.pomodoroCount);
      setRelatedApplications(task.relatedApplications ?? []);
    } else {
      setTitle("");
      setDescription("");
      setPomodoroCount(0);
      setRelatedApplications([]);
    }
    setConfirmDelete(false);
  }, [task, mode, isOpen]);

  const handleClose = () => {
    onClose();
    setConfirmDelete(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      pomodoroCount,
      relatedApplications,
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (task?.id) onDelete?.(task.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "add" ? "New Task" : "Edit Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Task title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
            placeholder="Describe the task... URLs like https://example.com will become clickable links."
          />
          {description.trim() && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap break-words">
              <div className="text-xs text-gray-400 mb-1 font-medium">Preview</div>
              {renderDescriptionWithLinks(description)}
            </div>
          )}
        </div>

        {applications.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linked Applications
            </label>
            <Select
              isMulti
              options={appOptions}
              value={appOptions.filter((o) => relatedApplications.includes(o.value))}
              onChange={(selected) =>
                setRelatedApplications(selected.map((o) => o.value))
              }
              placeholder="Link to applications..."
              classNamePrefix="react-select"
              noOptionsMessage={() => "No applications found"}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pomodoro Target{" "}
            <span className="text-gray-400 font-normal text-xs">
              (0 = none, -1 = unlimited)
            </span>
          </label>
          <input
            type="number"
            value={pomodoroCount}
            onChange={(e) => setPomodoroCount(parseInt(e.target.value, 10) || 0)}
            min={-1}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-between pt-2 border-t border-gray-100">
          {mode === "edit" && onDelete ? (
            <PrimaryButton type="button" variant="danger" onClick={handleDelete}>
              {confirmDelete ? "Confirm Delete" : "Delete"}
            </PrimaryButton>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <PrimaryButton type="submit">
              {mode === "add" ? "Create Task" : "Save Changes"}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}
