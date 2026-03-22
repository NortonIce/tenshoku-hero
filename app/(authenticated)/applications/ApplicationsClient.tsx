"use client";
import { useState, useEffect, useRef } from "react";
import { Application, ApplicationStep } from "@/types/Application";
import { Resume } from "@/types/Resume";
import ApplicationModal from "@/app/components/ApplicationModal";
import { PrimaryButton } from "@/app/components/buttons/PrimaryButton";
import { ApplicationListElement } from "@/app/components/listElements/ApplicationListElement";
import StatusBadge from "@/app/components/StatusBadge";

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
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const statusButtonRef = useRef<HTMLButtonElement | null>(null);
  const statusPopupRef = useRef<HTMLDivElement | null>(null);
  const [resumeMap, setResumeMap] = useState<Record<string, string>>({});

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusPopupRef.current &&
        !statusPopupRef.current.contains(event.target as Node) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target as Node)
      ) {
        setIsStatusPopupOpen(false);
      }
    }
    if (isStatusPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatusPopupOpen]);

  const statusOptions = [
    "Preparation",
    "Applied",
    "Recieved Take Home Assignment",
    "Sent Take Home Assignment",
    "Interview",
    "Offer",
    "Rejected",
    "Ignored",
    "Abandoned",
  ];

  useEffect(() => {
    setApplications(initialApplications);
    fetchApplications();
    fetchResumes();
  }, [initialApplications]);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (!response.ok) return;
      const data: Resume[] = await response.json();
      const map: Record<string, string> = {};
      data.forEach((r) => { if (r._id) map[r._id] = r.title; });
      setResumeMap(map);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    }
  };

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

  const handleDeleteApplication = async (id: string) => {
    try {
      const response = await fetch(`/api/applications?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      setApplications((prev) => prev.filter((app) => app.id !== id));
      setIsModalOpen(false);
      setSelectedApplication(null);
    } catch (err) {
      console.error("Error deleting application:", err);
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

  // Filter applications by company name and selected statuses
  const filteredApplications = applications.filter((application: Application) => {
    const matchesSearch = application.company.toLowerCase().includes(search.toLowerCase());
    const status = getOverallStatus(application);
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(status);
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
          Add application
        </PrimaryButton>
        <div className="flex gap-2 items-center ml-4 relative">
          <input
            type="text"
            placeholder="Search by company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{ minWidth: 220 }}
          />
          <button
            ref={statusButtonRef}
            type="button"
            className="mt-1 block px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center gap-2"
            onClick={() => setIsStatusPopupOpen((v) => !v)}
          >
            <span>Status{statusFilters.length > 0 ? ` (${statusFilters.length})` : ""}</span>
            <svg className={`w-4 h-4 transition-transform ${isStatusPopupOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isStatusPopupOpen && (
            <div
              ref={statusPopupRef}
              className="absolute z-20 top-12 right-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3 flex flex-col gap-1"
            >
              <div className="font-semibold text-sm mb-2">Filter by Status</div>
              <div className="max-h-60 overflow-y-auto flex flex-col gap-1">
                {statusOptions.map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-blue-50">
                    <input
                      type="checkbox"
                      checked={statusFilters.includes(status)}
                      onChange={() => {
                        setStatusFilters((prev) =>
                          prev.includes(status)
                            ? prev.filter((s) => s !== status)
                            : [...prev, status]
                        );
                      }}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-2 gap-2">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline px-2 py-1 rounded disabled:opacity-50"
                  onClick={() => setStatusFilters(statusOptions)}
                  disabled={statusFilters.length === statusOptions.length}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline px-2 py-1 rounded disabled:opacity-50"
                  onClick={() => setStatusFilters([])}
                  disabled={statusFilters.length === 0}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Counter */}
      <div className="mx-2 mb-1 text-sm text-gray-500">
        {search || statusFilters.length > 0
          ? `${filteredApplications.length} of ${applications.length} applications`
          : `${applications.length} application${applications.length !== 1 ? "s" : ""}`}
      </div>

      {/* Main content */}
      <div className="flex-1 mr-2 ml-2 min-h-0 overflow-y-auto md:overflow-visible gap-6">
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
              <>
                {/* Mobile: keep cards */}
                <div className="md:hidden space-y-4">
                  {filteredApplications.map((application) => (
                    <ApplicationListElement
                      key={application.id}
                      application={application}
                      alwaysCompact
                      onClick={(application) => {
                        setModalMode("edit");
                        setSelectedApplication(application);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                  <br />
                </div>

                {/* Desktop: table */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">Company</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">Position</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">Job Site</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">Resume</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">Link</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">Last Update</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.map((application) => {
                          const status = getOverallStatus(application);
                          return (
                            <tr
                              key={application.id}
                              className="hover:bg-blue-50 cursor-pointer"
                              onClick={() => {
                                setModalMode("edit");
                                setSelectedApplication(application);
                                setIsModalOpen(true);
                              }}
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 truncate max-w-[240px]">{application.company}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[280px]">{application.position}</td>
                              <td className="px-4 py-3 text-sm text-indigo-600 truncate max-w-[220px]">
                                <a
                                  href={application.jobSite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {application.jobSite}
                                </a>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {application.resume ? (
                                  <a
                                    href={application.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {resumeMap[application.resume] ?? application.resume}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {application.link ? (
                                  <a
                                    href={application.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View Job Posting
                                  </a>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                {new Date(
                                  application.steps?.length
                                    ? application.steps.slice().sort((a, b) => b.order - a.order)[0].date
                                    : application.createdAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <StatusBadge status={status as any} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
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
        onDelete={handleDeleteApplication}
        application={selectedApplication}
        mode={modalMode}
      />
    </div>
  );
}
