import { NextRequest } from "next/server";
import {
  isCloudinaryConfigured,
  isValidImageFile,
  isValidVideoFile,
  uploadImageBuffer,
  uploadVideoBuffer,
  deleteImageFromCloudinary,
  deleteVideoFromCloudinary,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

  const isVideo = file.type.startsWith("video/");
  const validation = isVideo ? isValidVideoFile(file) : isValidImageFile(file);
  if (!validation.ok) {
    return Response.json(
      { success: false, error: validation.error },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = isVideo
      ? await uploadVideoBuffer(buffer)
      : await uploadImageBuffer(buffer);

    return Response.json({ success: true, secure_url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return Response.json(
      { success: false, error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = process.env.UPLOAD_API_TOKEN;
  if (token && request.headers.get("x-upload-token") !== token) {
    return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const publicId = searchParams.get("publicId");
  const resourceType = searchParams.get("resourceType") || "image";

  if (!publicId) {
    return Response.json(
      { success: false, error: "publicId is required." },
      { status: 400 },
    );
  }

  try {
    const deleted =
      resourceType === "video"
        ? await deleteVideoFromCloudinary(publicId)
        : await deleteImageFromCloudinary(publicId);

    return Response.json({ success: deleted });
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    return Response.json(
      { success: false, error: "Delete failed. Please try again." },
      { status: 500 },
    );
  }
}
