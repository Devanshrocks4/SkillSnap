import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "../lib/firebase/config";

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export type UploadProgressCallback = (progress: UploadProgress) => void;

/**
 * Upload a resume file
 */
export async function uploadResume(
  userId: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  // Create file reference: resumes/{userId}/{filename}
  const fileName = `${userId}/${file.name}`;
  const storageRef = ref(storage, `resumes/${fileName}`);

  // Upload with progress tracking
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: snapshot.bytesTransferred / snapshot.totalBytes,
          };
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        // Upload complete, get download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

/**
 * Delete a resume file
 */
export async function deleteResume(userId: string, fileName: string): Promise<void> {
  const storageRef = ref(storage, `resumes/${userId}/${fileName}`);
  await deleteObject(storageRef);
}

/**
 * Get all resumes for a user
 */
export async function getUserResumes(userId: string): Promise<string[]> {
  const storageRef = ref(storage, `resumes/${userId}`);
  const result = await listAll(storageRef);
  const urls = await Promise.all(
    result.items.map((item) => getDownloadURL(item))
  );
  return urls;
}

/**
 * Get resume download URL
 */
export async function getResumeUrl(userId: string, fileName: string): Promise<string> {
  const storageRef = ref(storage, `resumes/${userId}/${fileName}`);
  return getDownloadURL(storageRef);
}
