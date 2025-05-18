import { NextRequest, NextResponse } from "next/server";
import { GoogleDriveClient } from "@/app/services/googleDrive";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const driveClient = new GoogleDriveClient(
      request.cookies.get("googleDriveRefreshToken")?.value || ""
    );
    const result = await driveClient.uploadFile(file);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
