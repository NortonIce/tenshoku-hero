"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import IconButton from "@/app/components/buttons/IconButton";
import type { Resume } from "@/types/Resume";
import { PrimaryButton } from "@/app/components/buttons/PrimaryButton";

export default function ResumesClient(props: {
  clientId: string;
  redirectUri: string;
  isGoogleDriveConnected?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/resumes");
      if (!response.ok) throw new Error("Failed to fetch resumes");
      const data = await response.json();
      setResumes(data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  function getGoogleDriveAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: props.clientId,
      redirect_uri: props.redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/drive.file",
      access_type: "offline",
      prompt: "consent",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  const handleGoogleDriveAuth = () => {
    const authUrl = getGoogleDriveAuthUrl();
    window.location.href = authUrl;
  };

  const handleUpload = async () => {
    if (!title) return;

    setIsUploading(true);
    try {
      let fileId = null;
      let link = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch("/api/google-drive/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file");
        }

        const uploadResult = await uploadResponse.json();
        fileId = uploadResult.fileId;
        link = uploadResult.webViewLink;
      }

      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          fileId,
          link,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create resume");
      }

      const newResume = await response.json();
      setResumes((prev) => [...prev, newResume]);
      setIsModalOpen(false);
      setTitle("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error creating resume:", error);
      alert("Failed to create resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex px-4 sm:px-6 lg:px-10 2xl:px-16 py-3 justify-between items-center">
        <div className="flex items-center gap-2">
          <PrimaryButton onClick={() => setIsModalOpen(true)}>
            Add Resume
          </PrimaryButton>
          <PrimaryButton onClick={() => handleGoogleDriveAuth()}>
            Connect to Google Drive
          </PrimaryButton>
          {props.isGoogleDriveConnected ? (
            <span className="text-green-600 text-sm">Google Drive connected</span>
          ) : (
            <span className="text-red-600 text-sm">Google Drive not connected</span>
          )}
        </div>
      </div>

      {/* Counter */}
      <div className="px-4 sm:px-6 lg:px-10 2xl:px-16 mb-1">
        <span className="text-sm text-gray-500">
          {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-10 2xl:px-16 min-h-0 overflow-y-auto">
        {isLoading && resumes.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No resumes yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new resume.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Title</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Created</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Used</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Link</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resumes.map((resume) => {
                  const usedTimes = resume.applications
                    ? Object.values(resume.applications).reduce((sum, n) => sum + (n || 0), 0)
                    : 0;
                  return (
                    <tr key={resume._id} className="hover:bg-blue-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{resume.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{new Date(resume.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{usedTimes} times</td>
                      <td className="px-4 py-3 text-sm">
                        {resume.link ? (
                          <a
                            href={resume.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                          >
                            View in Google Drive
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Resume"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Software Engineer Resume"
            />
          </div>
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Resume File (Optional)
            </label>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleFileSelect}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div className="mt-5 sm:mt-6">
            <IconButton
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading || !title}
            >
              {isUploading ? "Creating..." : "Create Resume"}
            </IconButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
