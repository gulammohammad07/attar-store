import { NextRequest } from "next/server";
import {
  isCloudinaryConfigured,
  isValidImageFile,
  uploadImageBuffer,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Protect the route with a shared secret. When UPLOAD_API_TOKEN is
  // undefined (local dev), the check is skipped so the flow still works.
  const token = process.env.UPLOAD_API_TOKEN;
  if (token && request.headers.get("x-upload-token") !== token) {
    return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return Response.json(
      { success: false, error: "Cloudinary is not configured." },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { success: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json(
      { success: false, error: "No file was provided." },
      { status: 400 },
    );
  }

  const validation = isValidImageFile(file);
  if (!validation.ok) {
    return Response.json(
      { success: false, error: validation.error },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const { secure_url, public_id } = await uploadImageBuffer(buffer);

    return Response.json({ success: true, secure_url, public_id });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return Response.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
