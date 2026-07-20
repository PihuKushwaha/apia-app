import { storage } from "../firebase/config.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Uploads to Firebase Storage and returns a public download URL.
// Used instead of sending raw file bytes through the API request body,
// which is capped at ~4.5MB on Vercel serverless functions.
export async function uploadFileToStorage(file, ownerId) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Please use a file under 15MB.");
  }
  const path = `intake-uploads/${ownerId}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function extractDocument(payload) {
  const res = await fetch("/api/extract-document", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
