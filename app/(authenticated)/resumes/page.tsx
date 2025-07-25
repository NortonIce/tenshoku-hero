import { cookies } from "next/headers";
import ResumesClient from "./ResumesClient";

export default async function ResumesPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("googleDriveRefreshToken");

  const hasToken = !!refreshToken?.value;
  // return <div>Resumes</div>;
  return (
    <ResumesClient
      clientId={process.env.GOOGLE_CLIENT_ID || ""}
      redirectUri={process.env.GOOGLE_REDIRECT_URI || ""}
      isGoogleDriveConnected={hasToken}
    />
  );
}
