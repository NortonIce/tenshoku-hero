import React from "react";
import { Resume } from "@/types/Resume";

export default function ResumeListElement(props: {
  selectedResumeId?: string;
  resume: Resume;
  onClick: (resume: Resume) => void;
  /** if true, always use the compact (mobile) layout */
  alwaysCompact?: boolean;
}) {
  const { resume, onClick, selectedResumeId, alwaysCompact } = props;
  const isSelected = resume._id === selectedResumeId;

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

  const usedTimes = (countedResume: Resume) => {
    let count = 0;
    if (countedResume?.applications) {
      for (const [, value] of Object.entries(countedResume.applications)) {
        count += (value as number) || 0;
      }
    }
    return count;
  };

  return (
    <div key={resume._id}>
      {/* ——— MOBILE / COMPACT ——— */}
      <div
        onClick={() => onClick(resume)}
        className={`
          ${mobileWr} ${base} ${hoverShadow}
          ${isSelected ? selectedCl : defaultBd}
        `}
      >
        <div className="mb-3 flex flex-row justify-between">
          <div className="">
            <Label>Title</Label>
            <div className="font-semibold truncate">{resume.title}</div>
          </div>
          <div className="text-sm text-gray-500">
            {usedTimes(resume)} uses
          </div>
        </div>
        <div className="mb-3">
          <Label>Created</Label>
          <div className="text-sm text-gray-500">
            {new Date(resume.createdAt).toLocaleDateString()}
          </div>
        </div>
        {resume.link && (
          <div className="mb-3">
            <Label>Link</Label>
            <a
              href={resume.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
            >
              View in Google Drive
            </a>
          </div>
        )}
      </div>

      {/* ——— DESKTOP / ROW ——— */}
      <div
        onClick={() => onClick(resume)}
        className={`
          ${desktopWr} ${base} ${hoverShadow}
          ${isSelected ? selectedCl : defaultBd}
        `}
      >
        {/* Title */}
        <div className="flex-1 min-w-0 px-2">
          <Label>Title</Label>
          <div className="font-semibold truncate">{resume.title}</div>
        </div>

        {/* Created Date */}
        <div className="w-40 px-2">
          <Label>Created</Label>
          <div className="text-sm text-gray-500">
            {new Date(resume.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Usage Count */}
        <div className="w-32 px-2">
          <Label>Used</Label>
          <div className="text-sm text-gray-600">
            {usedTimes(resume)} times
          </div>
        </div>

        {/* Link */}
        <div className="flex-1 min-w-0 px-2">
          <Label>Link</Label>
          {resume.link ? (
            <a
              href={resume.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline truncate block"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
            >
              View in Google Drive
            </a>
          ) : (
            <div className="text-sm text-gray-500">—</div>
          )}
        </div>
      </div>
    </div>
  );
}
