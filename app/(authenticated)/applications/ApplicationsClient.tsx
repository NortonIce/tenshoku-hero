"use client";
import { useState, useEffect } from "react";
import { Application, ApplicationStep } from "@/types/Application";
import ApplicationModal from "@/app/components/ApplicationModal";
import { PrimaryButton } from "@/app/components/buttons/PrimaryButton";
import { ApplicationListElement } from "@/app/components/listElements/ApplicationListElement";

export default function ApplicationsClient({
  initialApplications
}: {
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setApplications(initialApplications);
    fetchApplications();
  }, [initialApplications]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError("Failed to load applications. Please try again later.");
      console.error("Error fetching applications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddApplication = async (
    application: Omit<Application, "id" | "applicationDate" | "createdAt">
  ) => {
    try {
      const newApplication = {
        ...application,
        id: crypto.randomUUID(),
        applicationDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplication),
      });

      if (!response.ok) {
        throw new Error("Failed to add application");
      }

      const addedApplication = await response.json();
      setApplications((prev) => [...prev, addedApplication]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding application:", err);
      // You might want to show an error message to the user here
    }
  };

  const handleEditApplication = async (application: Application) => {
    console.log("Editing application:", application);
    try {
      const response = await fetch("/api/applications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(application),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      const updatedApplication = await response.json();
      setApplications((prev) =>
        prev.map((app) =>
          app.id === updatedApplication.id ? updatedApplication : app
        )
      );
      setSelectedApplication(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating application:", err);
      // You might want to show an error message to the user here
    }
  };

  const handleModalSubmit = (
    data: Omit<Application, "id" | "createdAt"> | Application
  ) => {
    if (modalMode === "add") {
      handleAddApplication(data as Omit<Application, "id" | "createdAt">);
    } else {
      handleEditApplication(data as Application);
    }
  };

  // Helper to get the latest step
  const getLatestStep = (application: Application): ApplicationStep | null => {
    if (!application.steps || application.steps.length === 0) return null;
    return application.steps
      .sort((a: ApplicationStep, b: ApplicationStep) => a.order - b.order)
      .findLast((x: ApplicationStep) => true) || null;
  };
  // Helper to get overall status
  const getOverallStatus = (application: Application): string => {
    const latestStep = getLatestStep(application);
    if (!latestStep) return "Applied";
    if (latestStep.type.includes("Interview")) {
      return "Interview";
    }
    return latestStep.type;
  };

  // Filter applications by company name and status
  const filteredApplications = applications.filter((application: Application) => {
    const matchesSearch = application.company.toLowerCase().includes(search.toLowerCase());
    const status = getOverallStatus(application);
    const matchesStatus = statusFilter === "All" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex m-2 justify-between items-center">
        <PrimaryButton
          onClick={() => {
            setModalMode("add");
            setSelectedApplication(null);
            setIsModalOpen(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add new application
        </PrimaryButton>
        <div className="flex gap-2 items-center ml-4">
          <input
            type="text"
            placeholder="Search by company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{ minWidth: 220 }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{ minWidth: 180 }}
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Recieved Take Home Assignment">Recieved Take Home Assignment</option>
            <option value="Sent Take Home Assignment">Sent Take Home Assignment</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Ignored">Ignored</option>
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-y-auto gap-6">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <div className="w-3/3 ">
            {isLoading && applications.length === 0 ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <ApplicationListElement
                    key={application.id}
                    application={application}
                    onClick={(application) => {
                      setModalMode("edit");
                      setSelectedApplication(application);
                      setIsModalOpen(true);
                    }}
                  />
                ))}
                <br />
              </div>
            )}
          </div>
        )}
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedApplication(null);
        }}
        onSubmit={handleModalSubmit}
        application={selectedApplication}
        mode={modalMode}
      />
    </div>
  );
}
