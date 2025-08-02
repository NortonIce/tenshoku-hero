import React from "react";
import { Application } from "@/types/Application";
import StatusBadge from "../StatusBadge";

// Helper function to get the latest step
const getLatestStep = (application: Application) => {
  if (!application.steps || application.steps.length === 0) return null;
  // Sort by date and return the most recent one
  return application.steps
    .sort((a, b) => a.order - b.order)
    .findLast((x) => true);
};

// Helper function to get overall application status
const getOverallStatus = (application: Application) => {
  const latestStep = getLatestStep(application);
  if (!latestStep) return "Applied";
  // Map step types to simplified status for display
  if (latestStep.type.includes("Interview")) {
    return "Interview";
  }
  return latestStep.type;
};

export const ApplicationListElement = (props: {
  selectedApplicationId?: string;
  application: Application;
  onClick: (application: Application) => void;
  /** if true, always use the compact (mobile) layout */
  alwaysCompact?: boolean;
}) => {
  const { application, onClick, selectedApplicationId, alwaysCompact } = props;
  const isSelected = application.id === selectedApplicationId;
  const latestStep = getLatestStep(application);
  const overallStatus = getOverallStatus(application);

  // shared styles
  const base =
    "p-4 m-2 rounded-lg border cursor-pointer transition-all bg-white";
  const hoverShadow = "hover:shadow-xl shadow-lg";
  const selectedCl = "border-blue-500 ring-2 ring-blue-500 shadow-xl";
  const defaultBd = "border-gray-200 hover:border-blue-300";

  // responsive wrappers
  const mobileWr = `block ${alwaysCompact ? "" : "md:hidden"}`;
  const desktopWr = `hidden ${alwaysCompact ? "" : "md:flex items-center justify-between"
    }`;

  // a tiny Label component
  const Label = ({ children }: { children: React.ReactNode }) => (
    <div className="text-xs text-gray-400 uppercase mb-1">{children}</div>
  );

  return (
    <div key={application.id}>
      {/* ——— MOBILE / COMPACT ——— */}
      <div
        onClick={() => onClick(application)}
        className={`
          ${mobileWr} ${base} ${hoverShadow}
          ${isSelected ? selectedCl : defaultBd}
        `}
      >
        <div className="mb-3 flex flex-row justify-between">
          <div className="">
            <Label>Company</Label>
            <div className="font-semibold truncate">{application.company}</div>
          </div>
          <StatusBadge status={overallStatus} />
        </div>
        <div className="mb-3">
          <Label>Position</Label>
          <div className="text-sm text-gray-600 truncate">
            {application.position}
          </div>
        </div>
        {/* <div className="mb-3">
          <Label>Job Site</Label>
          <a
            href={application.jobSite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline truncate block"
            onClick={e => e.stopPropagation()}
          >
            {application.jobSite}
          </a>
        </div> */}
        {/* <div className="mb-3">
          <Label>Latest Step</Label>
          <div className="text-sm text-gray-500">
            {latestStep
              ? `${latestStep.type} (${new Date(
                  latestStep.date
                ).toLocaleDateString()})`
              : "No steps"}
          </div>
        </div> */}
        {/* <div className="mb-3">
          <Label>Steps Progress</Label>
          <div className="text-sm text-gray-500">
            {application.steps?.length || 0} step
            {application.steps?.length !== 1 ? "s" : ""}
          </div>
        </div> */}
        {application.resume && (
          <div className="mb-3">
            <Label>Resume</Label>
            <a
              href={application.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              Open in Google Drive
            </a>
          </div>
        )}
        {application.link && (
          <div className="mb-3">
            <Label>Link</Label>
            <a
              href={application.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              View Job Posting
            </a>
          </div>
        )}
      </div>

      {/* ——— DESKTOP / ROW ——— */}
      <div
        onClick={() => onClick(application)}
        className={`
          ${desktopWr} ${base} ${hoverShadow}
          ${isSelected ? selectedCl : defaultBd}
        `}
      >
        {/* Company */}
        <div className="flex-1 min-w-0 px-2">
          <Label>Company</Label>
          <div className="font-semibold truncate">{application.company}</div>
        </div>

        {/* Position */}
        <div className="flex-1 min-w-0 px-2">
          <Label>Position</Label>
          <div className="text-sm text-gray-600 truncate">
            {application.position}
          </div>
        </div>

        {/* Job Site */}
        <div className="w-38 min-w-0 px-2">
          <Label>Job Site</Label>
          <a
            href={application.jobSite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline truncate block"
            onClick={(e) => e.stopPropagation()}
          >
            {application.jobSite}
          </a>
        </div>

        {/* Latest Step */}
        {/* <div className="flex-1 px-2">
          <Label>Latest Step</Label>
          <div className="text-sm text-gray-500">
            {latestStep
              ? `${latestStep.type} (${new Date(
                  latestStep.date
                ).toLocaleDateString()})`
              : "No steps"}
          </div>
        </div> */}

        {/* Resume */}
        <div className="w-48 px-2">
          <Label>Resume</Label>
          {application.resume ? (
            <a
              href={application.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              Open in Google Drive
            </a>
          ) : (
            <div className="text-sm text-gray-500">—</div>
          )}
        </div>

        {/* Link */}
        <div className="w-48 px-2">
          <Label>Link</Label>
          {application.link ? (
            <a
              href={application.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              View Job Posting
            </a>
          ) : (
            <div className="text-sm text-gray-500">—</div>
          )}
        </div>

        {/* Status pill */}
        <div className="w-32 px-2">
          <Label>Status</Label>
          <StatusBadge status={overallStatus} />
        </div>
      </div>
    </div>
  );
};
