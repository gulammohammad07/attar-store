import { updateSession } from "@/lib/auth/session";
import { getCurrentUser } from "@/lib/auth/dal";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await updateSession();
  if (!session) {
    return Response.json({ user: null });
  }
  const user = await getCurrentUser();
  return Response.json({ user });
}
