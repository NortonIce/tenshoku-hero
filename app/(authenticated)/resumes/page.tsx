import ResumesClient from "./ResumesClient";

export default function ResumesPage() {
  return (
    <ResumesClient
      clientId={process.env.GOOGLE_CLIENT_ID || ""}
      redirectUri={process.env.GOOGLE_REDIRECT_URI || ""}
    />
  );
}
