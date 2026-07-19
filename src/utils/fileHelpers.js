export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadFileToStorage(file) {
  // Temporary local object URL
  // Later you can replace this with Firebase Storage,
  // Cloudinary, Supabase Storage, etc.
  return URL.createObjectURL(file);
}

export async function extractDocument(payload) {
  const res = await fetch("/api/extract-document", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (data.error) throw new Error(data.error);

  return data;
}