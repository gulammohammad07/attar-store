import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  ROLES,
  SESSION_COOKIE_NAME,
  getAuthSecret,
} from "@/lib/auth/config";

type SessionClaims = {
  id: string;
  email: string;
  role: string;
};

async function verifySessionToken(token?: string): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(getAuthSecret()), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }
    return { id: payload.id, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

function redirectToSignIn(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  url.search = `next=${encodeURIComponent(
    request.nextUrl.pathname + request.nextUrl.search,
  )}`;
  return NextResponse.redirect(url);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminArea) {
    if (!session) return redirectToSignIn(request);
    if (session.role !== ROLES.ADMIN && session.role !== ROLES.SUBADMIN) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!session) return redirectToSignIn(request);

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"],
};
