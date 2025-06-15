import { Application } from "@/types/Application";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Select from "react-select";

type ApplicationStatus = Application["status"];

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: Omit<Application, "id" | "createdAt">) => void;
}

export default function AddApplicationModal({
  isOpen,
  onClose,
  onSubmit,
}: AddApplicationModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newApplication);
    setNewApplication({
      company: "",
      position: "",
      jobSite: "",
      recruiter: "",
      status: "Applied" as ApplicationStatus,
      resume: "",
      coverLetter: "",
      applicationDate: new Date().toISOString().split("T")[0],
    });
  };

  const [resumeOptions, setResumeOptions] = useState<
    { _id: string; title: string }[]
  >([]);

  const [newApplication, setNewApplication] = useState({
    company: "",
    position: "",
    jobSite: "",
    recruiter: "",
    status: "Applied" as ApplicationStatus,
    resume: resumeOptions.length === 1 ? resumeOptions[0]._id : "",
    coverLetter: "",
    applicationDate: new Date().toISOString().split("T")[0],
  });

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
      console.log("Fetched resumes:", data);
      setResumeOptions(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Application"
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            value={newApplication.company}
            onChange={(e) =>
              setNewApplication({ ...newApplication, company: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Position
          </label>
          <input
            type="text"
            value={newApplication.position}
            onChange={(e) =>
              setNewApplication({ ...newApplication, position: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
            onChange={(option) =>
              setNewApplication({
                ...newApplication,
                resume: option ? option.value : "",
              })
            }
            className="mt-1"
            placeholder="Select a resume"
            isClearable
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Site
          </label>
          <input
            type="text"
            value={newApplication.jobSite}
            onChange={(e) =>
              setNewApplication({ ...newApplication, jobSite: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            Recruiter
          </label>
          <input
            type="text"
            value={newApplication.recruiter}
            onChange={(e) =>
              setNewApplication({
                ...newApplication,
                recruiter: e.target.value,
              })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Application Date
          </label>
          <input
            type="date"
            value={newApplication.applicationDate}
            onChange={(e) =>
              setNewApplication({
                ...newApplication,
                applicationDate: e.target.value,
              })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={newApplication.status}
            onChange={(e) =>
              setNewApplication({
                ...newApplication,
                status: e.target.value as ApplicationStatus,
              })
            }
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Applied">Applied</option>
            <option value="Take home assignment">Take home assignment</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <textarea
            value={newApplication.coverLetter}
            onChange={(e) =>
              setNewApplication({
                ...newApplication,
                coverLetter: e.target.value,
              })
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
            Add Application
          </button>
        </div>
      </form>
    </Modal>
  );
}
