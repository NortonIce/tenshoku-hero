export default function StatusBadge({
  status,
}: {
  status:
  | "Preparation"
  | "Applied"
  | "Recieved Take Home Assignment"
  | "Sent Take Home Assignment"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Ignored"
  | "Abandoned";
}) {
  return (
    <span
      className={`
              max-h-7 px-2 py-1 rounded-full text-sm whitespace-nowrap
              ${status === "Preparation" ? "bg-orange-100 text-orange-800" : ""}
              ${status === "Applied" ? "bg-blue-100  text-blue-800" : ""}
              ${status === "Recieved Take Home Assignment"
          ? "bg-yellow-100 text-yellow-800"
          : ""
        }
        ${status === "Sent Take Home Assignment"
          ? "bg-yellow-100 text-yellow-800"
          : ""
        }
              ${status === "Interview" ? "bg-green-100 text-green-800" : ""}
              ${status === "Rejected" ? "bg-red-100    text-red-800" : ""}
              ${status === "Offer" ? "bg-purple-100 text-purple-800" : ""}
              ${status === "Ignored" ? "bg-gray-200 text-gray-600" : ""}
              ${status === "Abandoned" ? "bg-slate-200 text-slate-600" : ""}
            `}
    >
      {status}
    </span>
  );
}
