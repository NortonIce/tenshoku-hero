"use client";
import { useState, useEffect } from "react";
import { Application } from "@/types/Application";
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

  return (
    <div className="h-screen flex flex-col">
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
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto gap-6 ">
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
                {applications.map((application) => (
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
