import { Application } from "@/types/Application";

export const ApplicationListElement = (props: {
  selectedApplicationId?: string;
  application: Application;
  onClick: (application: Application) => void;
}) => {
  const { application, onClick, selectedApplicationId } = props;

  return (
    <div
      key={application.id}
      onClick={() => onClick(application)}
      className={`p-4 m-2 rounded-lg border cursor-pointer transition-all bg-white hover:bg-white shadow-lg hover:shadow-xl ${
        application?.id === selectedApplicationId
          ? "border-blue-500 ring-2 ring-blue-500 bg-white shadow-xl"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold">{application.company}</h3>
          <p className="text-sm text-gray-600">{application.position}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            application.status === "Applied"
              ? "bg-blue-100 text-blue-800"
              : application.status === "Interview"
              ? "bg-yellow-100 text-yellow-800"
              : application.status === "Rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {application.status}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{application.jobSite}</p>
      <p className="text-sm text-gray-500">
        Applied on {new Date(application.applicationDate).toLocaleDateString()}
      </p>
    </div>
  );
};
