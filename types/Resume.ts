export interface Resume {
  _id?: string;
  title: string;
  notes?: string;
  link?: string;
  fileId?: string;
  webViewLink?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  applications?: Map<string, number>; // Array of application IDs associated with this resume
}
