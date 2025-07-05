"use client";
import { useState, useEffect } from "react";
import { Application } from "@/types/Application";
import AddApplicationModal from "@/app/components/AddApplicationModal";
import EditApplicationModal from "@/app/components/EditApplicationModal";
import { PrimaryButton } from "@/app/components/buttons/PrimaryButton";
import { ApplicationListElement } from "@/app/components/listElements/ApplicationListElement";
import { Resume } from "@/types/Resume";

export default function ApplicationsClient() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }
      const data = await response.json();
      console.log("Fetched resumes:", data);
      setResumes(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  useEffect(() => {
    // Run once on mount
    fetchApplications();
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setIsAddModalOpen(false);
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
      setSelectedApplication(updatedApplication);
    } catch (err) {
      console.error("Error updating application:", err);
      // You might want to show an error message to the user here
    }
  };

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex m-2 justify-between items-center">
        <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
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
        {/* Applications list */}
        <div className="w-3/3 ">
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationListElement
                key={application.id}
                application={application}
                resumes={resumes}
                onClick={setSelectedApplication}
              />
            ))}
          </div>
        </div>
      </div>

      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddApplication}
      />

      <EditApplicationModal
        isOpen={selectedApplication !== null}
        onClose={() => {
          setSelectedApplication(null);
        }}
        onSubmit={handleEditApplication}
        application={selectedApplication}
      />
    </div>
  );
}
