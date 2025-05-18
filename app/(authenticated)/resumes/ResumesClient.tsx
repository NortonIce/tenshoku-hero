"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import IconButton from "@/app/components/buttons/IconButton";
import type { Resume } from "@/types/Resume";

export default function ResumesClient(props: {
  clientId: string;
  redirectUri: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Resumes</h2>
        <IconButton onClick={() => setIsModalOpen(true)}>Add Resume</IconButton>
      </div>
      <IconButton onClick={() => handleGoogleDriveAuth()}>
        Authorize Google Drive
      </IconButton>
      {resumes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No resumes yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new resume.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
            >
              <h3 className=" mb-2">
                <b>{resume.title}</b>{" "}
                <div className="text-sm ">
                  {new Date(resume.createdAt).toLocaleDateString()}
                </div>
              </h3>
              {resume.link && (
                <a
                  href={resume.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  View in Google Drive
                </a>
              )}
            </div>
          ))}
        </div>
      )}

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
