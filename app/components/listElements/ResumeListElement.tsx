import { Resume } from "@/types/Resume";

export default function ResumeListElement(props: {
  selectedResumeId?: string;
  resume: Resume;
  onClick: (resume: Resume) => void;
}) {
  const { resume, onClick, selectedResumeId } = props;

  const usedTimes = (() => {
    let count = 0;
    resume?.applications?.forEach((application) => {
      count += application;
    });
    return count;
  })();

  return (
    <div
      key={resume._id}
      className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
    >
      <h3 className=" mb-2">
        <b>{resume.title}</b> <div>Applied {usedTimes} times</div>{" "}
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
  );
}
