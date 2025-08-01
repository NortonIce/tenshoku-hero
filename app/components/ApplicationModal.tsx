import {
  Application,
  ApplicationStep,
  ApplicationStepType,
} from "@/types/Application";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    application: Omit<Application, "id" | "createdAt"> | Application
  ) => void;
  application?: Application | null; // null for add mode, Application for edit mode
  mode: "add" | "edit";
}

const stepTypes: ApplicationStepType[] = [
  "Applied",
  "Recieved Take Home Assignment",
  "Sent Take Home Assignment",
  "Interview",
  "Offer",
  "Rejected",
  "Ignored",
];

// Hardcoded position suggestions
const positionSuggestions = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "QA Engineer",
  "DevOps Engineer",
];

// Hardcoded job site suggestions
const jobSiteSuggestions = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "AngelList",
  "Company Website",
  "Stack Overflow",
  "Hired",
  "ZipRecruiter",
  "Monster",
];


export default function ApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  application,
  mode,
}: ApplicationModalProps) {
  const [resumeOptions, setResumeOptions] = useState<
    { _id: string; title: string }[]
  >([]);

  const [formData, setFormData] = useState<{
    company: string;
    position: string;
    jobSite: string;
    recruiter: string;
    resume: string;
    coverLetter: string;
    link?: string;
    steps: ApplicationStep[];
  }>({
    company: "",
    position: "",
    jobSite: "",
    recruiter: "",
    resume: "",
    coverLetter: "",
    link: "",
    steps: [
      {
        id: crypto.randomUUID(),
        type: "Applied" as ApplicationStepType,
        date: new Date().toISOString().split("T")[0],
        notes: "",
        order: 0,
      },
    ],
  });

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === "edit" && application) {
      setFormData({
        company: application.company,
        position: application.position || "",
        jobSite: application.jobSite,
        recruiter: application.recruiter || "",
        resume: application.resume || "",
        coverLetter: application.coverLetter || "",
        link: application.link || "",
        steps: application.steps?.map(step => ({
          ...step,
          notes: step.notes || ""
        })) || [],
      });
    } else if (mode === "add") {
      setFormData({
        company: "",
        position: "",
        jobSite: "",
        recruiter: "",
        resume: resumeOptions.length === 1 ? resumeOptions[0]._id : "",
        coverLetter: "",
        link: "",
        steps: [
          {
            id: crypto.randomUUID(),
            type: "Applied" as ApplicationStepType,
            date: new Date().toISOString().split("T")[0],
            notes: "",
            order: 0,
          },
        ],
      });
    }
  }, [mode, application, resumeOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "edit" && application) {
      // For edit mode, include the id
      onSubmit({
        ...application,
        ...formData,
      });
    } else {
      // For add mode, exclude id and createdAt
      onSubmit(formData);
    }

    // Reset form for add mode
    if (mode === "add") {
      setFormData({
        company: "",
        position: "",
        jobSite: "",
        recruiter: "",
        resume: "",
        coverLetter: "",
        link: "",
        steps: [
          {
            id: crypto.randomUUID(),
            type: "Applied" as ApplicationStepType,
            date: new Date().toISOString().split("T")[0],
            notes: "",
            order: 0,
          },
        ],
      });
    }
  };

  const addStep = () => {
    const newStep: ApplicationStep = {
      id: crypto.randomUUID(),
      type: "Phone Screen" as ApplicationStepType,
      date: new Date().toISOString().split("T")[0],
      notes: "",
      order: formData.steps.length, // Set order to next index
    };
    setFormData({
      ...formData,
      steps: [...formData.steps, newStep],
    });
  };

  const removeStep = (stepId: string) => {
    if (formData.steps.length <= 1) return; // Keep at least one step
    const filteredSteps = formData.steps.filter((step) => step.id !== stepId);
    // Re-index order
    const reindexedSteps = filteredSteps.map((step, idx) => ({ ...step, order: idx }));
    setFormData({
      ...formData,
      steps: reindexedSteps,
    });
  };

  const updateStep = (
    stepId: string,
    field: keyof ApplicationStep,
    value: any
  ) => {
    setFormData({
      ...formData,
      steps: formData.steps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step
      ),
    });
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }
      const data = await response.json();
      setResumeOptions(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const modalTitle =
    mode === "add" ? "Add New Application" : "Edit Application";

  // Helper to get quick step options based on last step
  const getQuickStepOptions = () => {
    if (!formData.steps.length) return [];
    const lastType = formData.steps[formData.steps.length - 1].type;
    switch (lastType) {
      case "Applied":
        return ["Ignored", "Recieved Take Home Assignment", "Interview"];
      case "Recieved Take Home Assignment":
        return ["Sent Take Home Assignment"];
      case "Sent Take Home Assignment":
        return ["Rejected", "Interview"];
      case "Interview":
        return ["Rejected", "Offer"];
      default:
        return [];
    }
  };

  // Handler to add a quick step
  const addQuickStep = (type: ApplicationStepType) => {
    const newStep: ApplicationStep = {
      id: crypto.randomUUID(),
      type,
      date: new Date().toISOString().split("T")[0],
      notes: "",
      order: formData.steps.length, // Set order to next index
    };
    setFormData({
      ...formData,
      steps: [...formData.steps, newStep],
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="2xl">
      <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <CreatableSelect
            isClearable
            options={positionSuggestions.map((pos) => ({ value: pos, label: pos }))}
            value={formData.position ? { value: formData.position, label: formData.position } : null}
            onChange={(option) =>
              setFormData({ ...formData, position: option ? option.value : "" })
            }
            className="mt-1"
            placeholder="Enter or select a position"
            styles={{
              menu: (base) => ({ ...base, maxWidth: "100%", zIndex: 9999 }),
              control: (base) => ({ ...base, minWidth: 0 }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resume
          </label>
          <Select
            options={resumeOptions.map((resume) => ({
              value: resume._id,
              label: resume.title,
            }))}
            value={(() => {
              const resume = resumeOptions.find(
                (r) => r._id === formData.resume
              );
              return resume ? { value: resume._id, label: resume.title } : null;
            })()}
            onChange={(option) =>
              setFormData({
                ...formData,
                resume: option ? option.value : "",
              })
            }
            className="mt-1"
            placeholder="Select a resume"
            isClearable
            styles={{
              menu: (base) => ({ ...base, maxWidth: "100%", zIndex: 9999 }),
              control: (base) => ({ ...base, minWidth: 0 }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Site
          </label>
          <CreatableSelect
            isClearable
            options={jobSiteSuggestions.map((site) => ({ value: site, label: site }))}
            value={formData.jobSite ? { value: formData.jobSite, label: formData.jobSite } : null}
            onChange={(option) =>
              setFormData({ ...formData, jobSite: option ? option.value : "" })
            }
            className="mt-1"
            placeholder="Enter or select a job site"
            styles={{
              menu: (base) => ({ ...base, maxWidth: "100%", zIndex: 9999 }),
              control: (base) => ({ ...base, minWidth: 0 }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recruiter
          </label>
          <input
            type="text"
            value={formData.recruiter}
            onChange={(e) =>
              setFormData({ ...formData, recruiter: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Link
          </label>
          <input
            type="url"
            value={formData.link || ""}
            onChange={(e) =>
              setFormData({ ...formData, link: e.target.value })
            }
            placeholder="https://..."
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Application Steps
            </label>
            <div className="flex items-center gap-2">
              {getQuickStepOptions().map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addQuickStep(type as ApplicationStepType)}
                  className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${type === "Ignored" || type === "Rejected"
                      ? "text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500"
                      : "text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500"}
                  `}
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  {type}
                </button>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Step
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {[...formData.steps]
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <div
                  key={step.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Step {step.order + 1}
                    </span>
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Step Type
                      </label>
                      <select
                        value={step.type}
                        onChange={(e) =>
                          updateStep(step.id, "type", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {stepTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={step.date.split("T")[0]}
                        onChange={(e) =>
                          updateStep(step.id, "date", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={step.notes || ""}
                        onChange={(e) =>
                          updateStep(step.id, "notes", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Add notes..."
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <textarea
            value={formData.coverLetter}
            onChange={(e) =>
              setFormData({ ...formData, coverLetter: e.target.value })
            }
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {mode === "add" ? "Add Application" : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
