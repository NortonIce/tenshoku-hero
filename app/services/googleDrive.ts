import { google } from "googleapis";
import { Readable } from "stream";

export class GoogleDriveClient {
  private drive;

  constructor(refreshToken: string) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    console.log('env', process.env);

    console.log("OAuth2 client created with refresh token:", refreshToken);
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    this.drive = google.drive({ version: "v3", auth: oauth2Client });
  }

  async uploadFile(
    file: File
  ): Promise<{ fileId: string; webViewLink: string }> {
    try {
      const fileMetadata = {
        name: file.name,
        mimeType: file.type,
      };

      const media = {
        mimeType: file.type,
        body: Readable.from(Buffer.from(await file.arrayBuffer())),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id,webViewLink",
      });

      if (!response.data) {
        throw new Error("Upload failed: No response from Google Drive API");
      }

      return {
        fileId: response.data.id!,
        webViewLink: response.data.webViewLink!,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }
}
