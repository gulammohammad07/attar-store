import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth/dal";
import { ROLES } from "@/lib/auth/config";
import { CLOUDINARY_FOLDER, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";
export async function POST() {
  const user = await getCurrentUser();
  if (!user || (user.role !== ROLES.ADMIN && user.role !== ROLES.SUBADMIN)) return Response.json({ error: "Admin access is required." }, { status: 401 });
  if (!isCloudinaryConfigured()) return Response.json({ error: "Cloudinary is not configured." }, { status: 500 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = CLOUDINARY_FOLDER;
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, process.env.CLOUDINARY_API_SECRET!);
  return Response.json({ signature, timestamp, folder, apiKey: process.env.CLOUDINARY_API_KEY, cloudName: process.env.CLOUDINARY_CLOUD_NAME });
}
