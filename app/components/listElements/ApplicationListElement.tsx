import React from "react";
import { Application } from "@/types/Application";
import StatusBadge from "../StatusBadge";

export const ApplicationListElement = (props: {
  selectedApplicationId?: string;
  application: Application;
  onClick: (application: Application) => void;
  /** if true, always use the compact (mobile) layout */
  alwaysCompact?: boolean;
}) => {
  const { application, onClick, selectedApplicationId, alwaysCompact } = props;
  const isSelected = application.id === selectedApplicationId;

  // shared styles
  const base =
    "p-4 m-2 rounded-lg border cursor-pointer transition-all bg-white";
  const hoverShadow = "hover:shadow-xl shadow-lg";
  const selectedCl = "border-blue-500 ring-2 ring-blue-500 shadow-xl";
  const defaultBd = "border-gray-200 hover:border-blue-300";

  // responsive wrappers
  const mobileWr = `block ${alwaysCompact ? "" : "md:hidden"}`;
  const desktopWr = `hidden ${
    alwaysCompact ? "" : "md:flex items-center justify-between"
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
          <StatusBadge status={application.status} />
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
        <div className="mb-3">
          <Label>Applied On</Label>
          <div className="text-sm text-gray-500">
            {new Date(application.applicationDate).toLocaleDateString()}
          </div>
        </div>
        {application.resume && (
          <div className="mb-3">
            <Label>Resume</Label>
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              Download
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
        <div className="flex-1 min-w-0 px-2">
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

        {/* Applied On */}
        <div className="w-40 px-2">
          <Label>Applied On</Label>
          <div className="text-sm text-gray-500">
            {new Date(application.applicationDate).toLocaleDateString()}
          </div>
        </div>

        {/* Resume */}
        <div className="w-32 px-2">
          <Label>Resume</Label>
          {application.resume ? (
            <a
              href={application.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              Download
            </a>
          ) : (
            <div className="text-sm text-gray-500">—</div>
          )}
        </div>

        {/* Status pill */}
        <div className="w-30 px-2">
          <Label>Status</Label>
          <StatusBadge status={application.status} />
        </div>
      </div>
    </div>
  );
};
