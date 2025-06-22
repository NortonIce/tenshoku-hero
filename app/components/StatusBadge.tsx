export default function StatusBadge({
  status,
}: {
  status:
    | "Applied"
    | "Take home assignment"
    | "Interview"
    | "Rejected"
    | "Offer";
}) {
  return (
    <span
      className={`
              max-h-7 px-2 py-1 rounded-full text-sm whitespace-nowrap
              ${status === "Applied" ? "bg-blue-100  text-blue-800" : ""}
              ${
                status === "Take home assignment"
                  ? "bg-yellow-100 text-yellow-800"
                  : ""
              }
              ${status === "Interview" ? "bg-green-100 text-green-800" : ""}
              ${status === "Rejected" ? "bg-red-100    text-red-800" : ""}
              ${status === "Offer" ? "bg-purple-100 text-purple-800" : ""}
            `}
    >
      {status === "Take home assignment" ? "Take Home" : status}
    </span>
  );
}
