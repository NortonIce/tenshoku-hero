import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface GoogleDriveFile {
  id: string;
  webViewLink: string;
}

export function useGoogleDrive() {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Check if user has Google Drive access
    const checkGoogleDriveAccess = async () => {
      try {
        const response = await fetch('/api/google-drive/check');
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking Google Drive access:', error);
        setIsAuthenticated(false);
      }
    };

    if (session?.user) {
      checkGoogleDriveAccess();
    }
  }, [session]);

  const uploadFile = async (file: File): Promise<GoogleDriveFile | null> => {
    if (!isAuthenticated) {
      throw new Error('Google Drive not authenticated');
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/google-drive/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return {
        id: data.id,
        webViewLink: data.webViewLink,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isAuthenticated,
    isUploading,
    uploadFile,
  };
} 